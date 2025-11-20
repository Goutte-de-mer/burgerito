import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { me } from "./services/authService";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  let cookie = request.cookies.get("auth_token");

  if (!cookie) return NextResponse.redirect(new URL("/", request.url));

  try {
    const { user } = await me(cookie.value);
    console.log(user);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/profile/:path*",
};
