// GET /api/bars/[barId]/leaderboard
// Classement soirée en cours — top N joueurs par coins Play gagnés ce soir
// Public pour les joueurs du bar (rôle PLAYER ou staff)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseBody, leaderboardQuerySchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barId: string }> }
) {
  const { barId } = await params;

  const url = new URL(request.url);
  const parsed = parseBody(leaderboardQuerySchema, {
    type: url.searchParams.get('type') ?? 'SOIREE',
    limit: url.searchParams.get('limit') ?? '20',
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { type, limit } = parsed.data;

  // Calcul de la fenêtre temporelle selon le type
  const now = new Date();
  let since: Date = new Date(now.getTime() - 24 * 3600 * 1000); // défaut : 24h

  switch (type) {
    case 'SOIREE':
      // Soirée = depuis 17h du jour courant (ou depuis minuit si après minuit)
      const soireeStart = new Date(now);
      soireeStart.setHours(17, 0, 0, 0);
      since = now.getHours() >= 17 ? soireeStart : new Date(soireeStart.getTime() - 24 * 3600 * 1000);
      break;
    case 'HEBDO':
      since = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      break;
    case 'MENSUEL':
      since = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'ANNUEL':
      since = new Date(now.getFullYear(), 0, 1);
      break;
  }

  // Agrégation des coins PLAY gagnés par joueur sur la période
  const rankings = await prisma.coinLedger.groupBy({
    by: ['userId'],
    where: {
      barId,
      coinType: 'PLAY',
      amount: { gt: 0 }, // uniquement les crédits (pas les débits)
      createdAt: { gte: since },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: limit,
  });

  // Enrichissement avec les données joueurs
  const userIds = rankings.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, nickname: true, firstName: true, avatarUrl: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  const leaderboard = rankings.map((entry, index) => {
    const user = userMap.get(entry.userId);
    return {
      rank: index + 1,
      userId: entry.userId,
      displayName: user?.nickname ?? user?.firstName ?? 'Joueur',
      avatarUrl: user?.avatarUrl ?? null,
      totalCoins: entry._sum.amount ?? 0,
    };
  });

  return NextResponse.json({
    barId,
    type,
    since: since.toISOString(),
    leaderboard,
    updatedAt: new Date().toISOString(),
  });
}
