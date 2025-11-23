import "server-only";
import { SignJWT, jwtVerify } from "jose";
import SessionPayload from "@/types/sessionPayload";
import { cookies } from "next/headers";
import type User from "@/types/user";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt<T>(payload: T, expirationTime?: string) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime || "14d")
    .sign(encodedKey);
}

export async function decrypt<T>(
  session: string | undefined = "",
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as T;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
  const session = await encrypt<SessionPayload>({ user, expiresAt }, "5h");
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const payload = await decrypt<SessionPayload>(session);

  if (!payload || new Date(payload.expiresAt) < new Date()) {
    return null;
  }

  return payload.user;
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt<SessionPayload>(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 5 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
