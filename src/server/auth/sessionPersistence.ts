"use server";

import { cookies } from "next/headers";
import { auth } from "@/auth";

const SESSION_COOKIE_SUFFIX = "authjs.session-token";

export async function persistSession(remember: boolean) {
  if (remember) return;

  const session = await auth();
  if (!session) return;

  const store = await cookies();
  const sessionCookie = store.getAll().find((cookie) => cookie.name.endsWith(SESSION_COOKIE_SUFFIX));
  if (!sessionCookie) return;

  store.set(sessionCookie.name, sessionCookie.value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: sessionCookie.name.startsWith("__Secure-"),
  });
}
