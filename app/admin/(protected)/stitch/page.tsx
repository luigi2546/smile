"use client";

import { useState } from "react";

export default function StitchAdminPage() {
  const [templates, setTemplates] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function loadTemplates() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/v1/templates", method: "GET" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load templates");
      // Canonicalize response: many APIs return {templates: [...]}
      setTemplates(data?.templates ?? data ?? []);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  async function renderTemplate(id: string) {
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const renderParams = { /* customize render params here */ };
      const res = await fetch("/api/stitch/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, renderParams }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Render failed");
      if (data.storageUrl) setPreview(data.storageUrl);
      else if (data.imageUrl) setPreview(data.imageUrl);
      else if (data.preview) setPreview(data.preview);
      else setPreview(JSON.stringify(data));
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Stitch / Canva — Designs</h1>
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-sky-600 text-white rounded"
          onClick={loadTemplates}
          disabled={loading}
        >
          {loading ? "Loading…" : "Load Templates"}
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">Error: {error}</div>}

      {templates && (
        <div className="grid gap-3">
          {Array.isArray(templates) ? (
            templates.map((t: any) => (
              <div key={t.id ?? t.templateId ?? JSON.stringify(t)} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name ?? t.title ?? t.id ?? "Untitled"}</div>
                  <div className="text-sm text-slate-500">{t.description ?? ''}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => renderTemplate(t.id ?? t.templateId ?? t.id)}>
                    Render
                  </button>
                </div>
              </div>
            ))
          ) : (
            <pre className="whitespace-pre-wrap">{JSON.stringify(templates, null, 2)}</pre>
          )}
        </div>
      )}

      {preview && (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Preview</h2>
          <div className="border rounded p-2">
            {/* If preview is a data URL or remote URL it will render as an image */}
            <img src={preview} alt="stitch preview" className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
