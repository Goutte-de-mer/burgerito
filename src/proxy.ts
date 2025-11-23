import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { me } from "./services/authService";
import { createSession, getSession } from "./app/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("auth_token");
  const session = await getSession();

  // Routes d'authentification (login/register) - rediriger si déjà connecté
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Route protégée (profile) - nécessite une authentification
  if (pathname.startsWith("/profile")) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Vérifier d'abord si une session valide existe déjà
      const existingSession = await getSession();

      const { user } = await me(cookie.value);

      // Comparer avec la session existante
      if (existingSession && existingSession.id === user.id) {
        return NextResponse.next();
      }

      // Session différente ou inexistante, créer/mettre à jour la session
      await createSession(user);
      return NextResponse.next();
    } catch (error) {
      console.error("Proxy auth error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Pour toutes les autres routes, continuer normalement
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login", "/register"],
};
