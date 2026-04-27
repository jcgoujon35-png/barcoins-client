// Guard onboarding — protège les routes qui nécessitent une phase minimale
// Usage dans une API route : const err = await requirePhase(request, 'ENGAGEMENT'); if (err) return err;

import { OnboardingPhase } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PHASE_ORDER: Record<OnboardingPhase, number> = {
  DECOUVERTE: 0,
  ENGAGEMENT: 1,
  COMPLET:    2,
}

export async function requirePhase(
  request: NextRequest,
  minPhase: OnboardingPhase
): Promise<NextResponse | null> {
  const userId = request.headers.get('x-user-id')
  const barId  = request.headers.get('x-bar-id')

  if (!userId || !barId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const barClient = await prisma.barClient.findUnique({
    where: { userId_barId: { userId, barId } },
    select: { onboardingPhase: true },
  })

  if (!barClient) {
    return NextResponse.json({ error: 'Profil joueur introuvable' }, { status: 404 })
  }

  if (PHASE_ORDER[barClient.onboardingPhase] < PHASE_ORDER[minPhase]) {
    return NextResponse.json(
      {
        error: 'Phase onboarding insuffisante',
        required: minPhase,
        current: barClient.onboardingPhase,
      },
      { status: 403 }
    )
  }

  return null
}
