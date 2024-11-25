import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("auth_session")?.value;
  const pathName = req.nextUrl.pathname;

  async function validateToken(token: string) {
    const response = await fetch(`${process.env.HOST_NAME}/api/${token}`);

    if (!response.ok) {
      return { valid: false, error: "Invalid token" };
    }

    const tokenData = await response.json();
    if (!tokenData?.token) {
      return { valid: false, error: "Invalid token" };
    }

    return { valid: true, error: "Wrong Token" };
  }

  console.log("hello");

  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.redirect(`${req.nextUrl.origin}/login`);
  }

  if (token) {
    try {
      const { valid, error } = await validateToken(token);
      if (valid) {
        return NextResponse.next();
      }
      return NextResponse.json({ error }, { status: 403 });
    } catch (error) {
      console.error("Error during token verification:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Session validation for dashboard and sign-in routes
  try {
    const response = await fetch(
      `${process.env.HOST_NAME}/api/session/${sessionToken}`
    );
    const { valid: isValidToken } = await response.json();

    if (!isValidToken && pathName.startsWith("/home")) {
      const redirectResponse = NextResponse.redirect(
        `${req.nextUrl.origin}/login`
      );
      redirectResponse.cookies.set("auth_session", "", {
        path: "/",
        maxAge: 0,
      });
      return redirectResponse;
    }

    if (isValidToken && pathName.startsWith("/sign-in")) {
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
      maxAge: 0,
    });
    return redirectResponse;
  }
}

export const config = {
  matcher: ["/home/:path*", "/log-in", "/"],
};
