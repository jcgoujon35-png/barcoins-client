// ============================================================
// BARCOINS — Middleware de protection des routes
// Vérifie le JWT NextAuth et le rôle requis pour chaque zone
// ============================================================

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────
// Carte des protections par préfixe de route
// ─────────────────────────────────────────────

const ROUTE_PROTECTION = {
  // Zone joueur PWA → authentification OTP requise (rôle PLAYER)
  '/(client)': ['PLAYER'],

  // Zone dashboard gérant → staff uniquement
  '/(dashboard)': ['OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN'],

  // Zone animateur → ANIMATOR ou supérieur
  '/(animator)': ['OWNER', 'MANAGER', 'ANIMATOR'],

  // Backoffice BarCoins → OWNER uniquement (superadmin)
  '/(admin)': ['OWNER'],

  // API routes protégées
  '/api/bars': ['OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN', 'PLAYER'],
  '/api/admin': ['OWNER'],
} as const;

// Routes publiques (jamais redirigées)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/api/auth',
  '/api/health',
  '/manifest.json',
];

// ─────────────────────────────────────────────
// Middleware principal
// ─────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques → passe directement
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Assets statiques → passe directement
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  // Récupération du token JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Non authentifié → redirection login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string | undefined;

  // Vérification des accès par zone
  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_PROTECTION)) {
    if (pathname.startsWith(routePrefix)) {
      if (!role || !allowedRoles.includes(role as never)) {
        // Rôle insuffisant → redirection selon le type d'utilisateur
        if (role === 'PLAYER') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // Ajout du rôle dans les headers pour les API routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', token.id ?? '');
  response.headers.set('x-user-role', role ?? '');
  response.headers.set('x-bar-id', (token.barId as string) ?? '');

  return response;
}

// ─────────────────────────────────────────────
// Config matcher — Next.js optimisation
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-|.*\\.png$|.*\\.svg$).*)',
  ],
};
