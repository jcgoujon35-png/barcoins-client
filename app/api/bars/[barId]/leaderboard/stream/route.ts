// GET /api/bars/[barId]/leaderboard/stream
// SSE — classement temps réel pour l'écran du bar et les joueurs
// Connexion persistante : le client reçoit un événement à chaque mise à jour

import { NextRequest } from 'next/server';
import { createSSEStream } from '@/lib/sse';
import { SSE_CHANNELS } from '@/lib/sse';

export const runtime = 'nodejs'; // SSE nécessite Node.js runtime (pas Edge)
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barId: string }> }
) {
  const { barId } = await params;

  return createSSEStream({
    barId,
    channel: SSE_CHANNELS.LEADERBOARD,
  });
}
