"use server";

import { cookies } from "next/headers";

export async function setSessionTokenCookie(
  sessionId: string,
  expiresAt: Date
) {
  const cookiesStore = await cookies();

  cookiesStore.set("auth_session", sessionId, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}
export async function deleteSessionTokenCookie() {
  const cookiesStore = await cookies();
  cookiesStore.set("auth_session", "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
export async function getSessionToken() {
  const cookiesStore = await cookies();
  return cookiesStore.get("auth_session")?.value;
}
