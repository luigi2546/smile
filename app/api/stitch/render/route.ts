import { NextResponse } from "next/server";
import { stitchFetch } from "../../../../lib/stitch/client";
import { createClient } from "../../../../lib/supabase/server";
import { createServiceClient } from "../../../../lib/supabase/service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { templateId, renderParams } = payload as { templateId: string; renderParams?: any };

    if (!templateId) return NextResponse.json({ error: "templateId required" }, { status: 400 });
    if (!process.env.STITCH_BASE_URL) return NextResponse.json({ error: "STITCH_BASE_URL not configured" }, { status: 500 });

    const base = process.env.STITCH_BASE_URL.replace(/\/$/, "");
    const url = `${base}/v1/templates/${encodeURIComponent(templateId)}/render`;

    const res = await stitchFetch(url, {
      method: "POST",
      body: JSON.stringify(renderParams ?? {}),
      headers: { "Content-Type": "application/json" },
    });

    // Expecting res to contain either { imageUrl } or { base64 }
    const imageUrl = res.imageUrl ?? res.url ?? null;
    const base64 = res.base64 ?? res.data ?? null;

    // If we received base64 image data, try to upload to Supabase Storage
    if (base64) {
      try {
        const buf = Buffer.from(base64, "base64");
        const service = createServiceClient();
        const fileName = `stitch-renders/${Date.now()}.png`;
        const uploadRes = await service.storage.from("renders").upload(fileName, buf, {
          contentType: "image/png",
          upsert: true,
        });
        if (uploadRes.error) {
          return NextResponse.json({ preview: `data:image/png;base64,${base64}`, storageError: uploadRes.error.message });
        }
        const { data: publicData } = service.storage.from("renders").getPublicUrl(fileName);
        const publicUrl = publicData.publicUrl;

        // try to record metadata in stitch_renders table (use server client to get current user)
        try {
          const serverClient = createClient();
          const { data: userData } = await serverClient.auth.getUser();
          const staffId = userData?.user?.id ?? null;
          await service.from("stitch_renders").insert({
            staff_id: staffId,
            template_id: templateId,
            storage_url: publicUrl,
            preview_url: null,
            meta: res,
          });
        } catch (insertErr) {
          // ignore insert errors but return storage url
        }

        return NextResponse.json({ storageUrl: publicUrl, rawResponse: res });
      } catch (err: any) {
        return NextResponse.json({ preview: `data:image/png;base64,${base64}`, error: err?.message ?? String(err) }, { status: 200 });
      }
    }

    // Otherwise return imageUrl or raw response
    return NextResponse.json({ imageUrl, rawResponse: res });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
