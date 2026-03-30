// ============================================================
// BARCOINS — Configuration NextAuth
// Deux providers :
//   1. staff-credentials  → email + password (gérants, staff)
//   2. player-otp         → phone + code OTP SMS (joueurs)
// Sessions JWT (pas de session DB — plus simple, performant)
// ============================================================

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { StaffRole } from '@prisma/client';

// ─────────────────────────────────────────────
// Types étendus (voir types/next-auth.d.ts)
// ─────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      phone?: string | null;
      role?: StaffRole | 'PLAYER';
      barId?: string | null;
      name?: string | null;
    };
  }
  interface User {
    id: string;
    email?: string | null;
    phone?: string | null;
    role?: StaffRole | 'PLAYER';
    barId?: string | null;
    name?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    phone?: string | null;
    role?: StaffRole | 'PLAYER';
    barId?: string | null;
  }
}

// ─────────────────────────────────────────────
// Configuration NextAuth
// ─────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // ── Provider 1 : Staff (email + mot de passe) ──────────────
    CredentialsProvider({
      id: 'staff-credentials',
      name: 'Staff BarCoins',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const staff = await prisma.staffMember.findUnique({
          where: { email: credentials.email },
          include: { bar: { select: { id: true, slug: true, plan: true } } },
        });

        if (!staff || !staff.isActive) return null;

        const passwordOk = await bcrypt.compare(credentials.password, staff.passwordHash);
        if (!passwordOk) return null;

        return {
          id: staff.id,
          email: staff.email,
          name: staff.bar?.slug ?? 'BarCoins',
          role: staff.role,
          barId: staff.barId,
        };
      },
    }),

    // ── Provider 2 : Joueur (OTP SMS via Twilio) ───────────────
    // Flux : POST /api/auth/send-otp → Redis → ici validation
    CredentialsProvider({
      id: 'player-otp',
      name: 'Joueur BarCoins',
      credentials: {
        phone: { label: 'Téléphone', type: 'tel' },
        code: { label: 'Code OTP', type: 'text' },
        barId: { label: 'Bar ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null;

        // Vérification OTP via Redis (géré dans /api/auth/send-otp + /api/auth/verify-otp)
        const { verifyOtp } = await import('./otp');
        const isValid = await verifyOtp(credentials.phone, credentials.code);
        if (!isValid) return null;

        // Trouver ou créer le joueur
        const user = await prisma.user.upsert({
          where: { phone: credentials.phone },
          create: { phone: credentials.phone },
          update: {},
        });

        return {
          id: user.id,
          phone: user.phone,
          name: user.nickname ?? user.firstName ?? null,
          role: 'PLAYER' as const,
          barId: credentials.barId ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.barId = user.barId;
        token.phone = user.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.barId = token.barId;
        session.user.phone = token.phone;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};

// ─────────────────────────────────────────────
// Helpers d'autorisation (usage dans API routes)
// ─────────────────────────────────────────────

export function isStaff(role?: string | null): boolean {
  return ['OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN'].includes(role ?? '');
}

export function isOwnerOrManager(role?: string | null): boolean {
  return ['OWNER', 'MANAGER'].includes(role ?? '');
}

export function isPlayer(role?: string | null): boolean {
  return role === 'PLAYER';
}
