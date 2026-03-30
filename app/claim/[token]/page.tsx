'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type ClaimState = 'loading' | 'success' | 'error' | 'expired' | 'already_claimed' | 'auth_required';

interface ClaimResult {
  coinsAwarded: number;
  newPlayBalance: number;
  multiplierApplied: number;
  message: string;
}

export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = params.token as string;

  const [state, setState] = useState<ClaimState>('loading');
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Pas connecté → redirection login avec retour sur cette page
      router.push(`/login?callbackUrl=/claim/${token}`);
      return;
    }

    // Récupérer le barId depuis la session (joueur associé à un bar)
    const barId = session.user.barId;
    if (!barId) {
      setState('error');
      setErrorMsg('Aucun bar associé à ton compte. Scanne le QR d\'entrée du bar d\'abord.');
      return;
    }

    claimToken(barId);
  }, [status, session, token]);

  async function claimToken(barId: string) {
    try {
      const res = await fetch(`/api/bars/${barId}/transactions/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrToken: token, barId }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setState('already_claimed');
        return;
      }
      if (res.status === 410) {
        setState('expired');
        return;
      }
      if (!res.ok) {
        setState('error');
        setErrorMsg(data.error ?? 'Erreur inconnue');
        return;
      }

      setResult(data);
      setState('success');

      // Redirection automatique vers le dashboard après 3s
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch {
      setState('error');
      setErrorMsg('Impossible de contacter le serveur');
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}
    >
      {/* Loading */}
      {state === 'loading' && (
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⚡</div>
          <p className="text-lg font-medium" style={{ color: '#F2C96B' }}>Validation en cours…</p>
        </div>
      )}

      {/* Succès */}
      {state === 'success' && result && (
        <div className="text-center space-y-4 animate-bounce-once">
          <div className="text-7xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold" style={{ color: '#22C55E' }}>
            +{result.coinsAwarded} points !
          </h2>
          <p className="text-base" style={{ color: 'rgba(245,240,232,0.7)' }}>
            Multiplicateur ×{result.multiplierApplied} appliqué
          </p>
          <div
            className="rounded-2xl px-6 py-4 mt-4"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>Solde total</p>
            <p className="text-3xl font-bold" style={{ color: '#F2C96B' }}>
              {result.newPlayBalance} pts
            </p>
          </div>
          <p className="text-xs mt-6" style={{ color: 'rgba(245,240,232,0.4)' }}>
            Redirection dans 3 secondes…
          </p>
        </div>
      )}

      {/* Déjà utilisé */}
      {state === 'already_claimed' && (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-2">🔒</div>
          <h2 className="text-xl font-bold" style={{ color: '#EF4444' }}>QR déjà utilisé</h2>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
            Ce code a déjà été scanné par un joueur.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-3 rounded-xl font-bold"
            style={{ background: '#1A2942', color: '#F2C96B', border: '1px solid rgba(201,146,42,0.3)' }}
          >
            Retour au dashboard
          </button>
        </div>
      )}

      {/* Expiré */}
      {state === 'expired' && (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-2">⏱️</div>
          <h2 className="text-xl font-bold" style={{ color: '#E8860A' }}>QR expiré</h2>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
            Le code est valable 90 secondes seulement.<br />Demande un nouveau QR au barman.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-3 rounded-xl font-bold"
            style={{ background: '#1A2942', color: '#F2C96B', border: '1px solid rgba(201,146,42,0.3)' }}
          >
            Retour au dashboard
          </button>
        </div>
      )}

      {/* Erreur */}
      {state === 'error' && (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-2">❌</div>
          <h2 className="text-xl font-bold" style={{ color: '#EF4444' }}>Erreur</h2>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>{errorMsg}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-3 rounded-xl font-bold"
            style={{ background: '#1A2942', color: '#F2C96B', border: '1px solid rgba(201,146,42,0.3)' }}
          >
            Retour au dashboard
          </button>
        </div>
      )}
    </div>
  );
}
