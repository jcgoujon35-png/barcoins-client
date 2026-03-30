// GET /api/user/me
// Retourne le profil complet du joueur connecté + soldes coins pour le bar actif

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const barId  = request.headers.get('x-bar-id');
  const role   = request.headers.get('x-user-role');

  if (!userId || role !== 'PLAYER') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      firstName: true,
      lastName: true,
      nickname: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }

  // Soldes pour le bar actif (si barId fourni)
  let barClient = null;
  let bar = null;

  if (barId) {
    [barClient, bar] = await Promise.all([
      prisma.barClient.findUnique({
        where: { userId_barId: { userId, barId } },
        select: {
          playBalance: true,
          fideliteBalance: true,
          totalCoinsEarned: true,
          onboardingPhase: true,
          joinedAt: true,
        },
      }),
      prisma.bar.findUnique({
        where: { id: barId },
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          activeMultiplier: true,
          boostActive: true,
          boostExpiresAt: true,
        },
      }),
    ]);
  }

  // Dernières transactions du joueur pour ce bar
  let recentTransactions: Array<{ reason: string; amount: number; createdAt: Date }> = [];
  if (barId) {
    recentTransactions = await prisma.coinLedger.findMany({
      where: { userId, barId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { reason: true, amount: true, createdAt: true },
    });
  }

  return NextResponse.json({
    user,
    barClient: barClient ?? { playBalance: 0, fideliteBalance: 0, totalCoinsEarned: 0 },
    bar,
    recentTransactions,
  });
}

// PATCH /api/user/me — mise à jour profil joueur
export async function PATCH(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const role   = request.headers.get('x-user-role');

  if (!userId || role !== 'PLAYER') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Body invalide' }, { status: 400 }); }

  const { firstName, lastName, nickname } = body as Record<string, string>;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName  && { lastName  }),
      ...(nickname  && { nickname  }),
    },
    select: { id: true, firstName: true, lastName: true, nickname: true },
  });

  return NextResponse.json({ user: updated });
}
