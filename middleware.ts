import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const isDashboardHost = hostname === "dashboard.smilecentergh.com";
  const requestedPath = request.nextUrl.pathname;

  // Keep dashboard subdomain URLs clean even when existing app links use /admin/....
  if (isDashboardHost && requestedPath.startsWith("/admin")) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.pathname = requestedPath.replace(/^\/admin/, "") || "/";
    return NextResponse.redirect(canonicalUrl);
  }

  let internalPath = requestedPath;
  if (isDashboardHost) {
    internalPath = requestedPath === "/"
      ? "/admin/dashboard"
      : requestedPath === "/login"
        ? "/admin/login"
        : `/admin${requestedPath}`;
  }

  const internalUrl = request.nextUrl.clone();
  internalUrl.pathname = internalPath;
  let response = isDashboardHost
    ? NextResponse.rewrite(internalUrl, { request: { headers: request.headers } })
    : NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = internalPath.startsWith("/admin") && !internalPath.startsWith("/admin/login");

  if (isAdminRoute && !user) {
    const redirectUrl = new URL(isDashboardHost ? "/login" : "/admin/login", request.url);
    redirectUrl.searchParams.set("next", isDashboardHost
      ? internalPath.replace(/^\/admin/, "") || "/"
      : internalPath);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
