import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("auth_session")?.value;
  const pathName = req.nextUrl.pathname;

  if (!sessionToken) {
    if (!pathName.startsWith("/login")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/login`);
    }
    return NextResponse.next();
  }

  if (sessionToken) {
    try {
      const hostName = process.env.HOST_NAME || req.nextUrl.origin;
      const response = await fetch(`${hostName}/api/session/${sessionToken}`);

      if (!response.ok) {
        throw new Error(`Failed to validate session: ${response.status}`);
      }

      const { valid: isValidToken } = await response.json();

      if (!isValidToken && pathName.startsWith("/home")) {
        const redirectResponse = NextResponse.redirect(
          `${req.nextUrl.origin}/login`
        );
        redirectResponse.cookies.set("auth_session", "", {
          path: "/",
          maxAge: 0, // Expire the cookie
        });
        return redirectResponse;
      }

      if (isValidToken && pathName.startsWith("/login")) {
        return NextResponse.redirect(`${req.nextUrl.origin}/home`);
      }

      return NextResponse.next();
    } catch (err) {
      console.error("Error validating session:", err);

      const redirectResponse = NextResponse.redirect(
        `${req.nextUrl.origin}/login`
      );
      redirectResponse.cookies.set("auth_session", "", {
        path: "/",
        maxAge: 0, // Expire the cookie
      });
      return redirectResponse;
    }
  }
}

export const config = {
  matcher: ["/home/:path*", "/login", "/"], // Ensure these match your route structure
};
