'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { PlanKey } from '@/config/business-rules';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SessionStats {
  coinsDistributed: number;
  transactionCount: number;
  playerCount: number;
}

interface BarInfo {
  id: string; name: string; plan: string;
  boostActive: boolean; boostExpiresAt?: string | null;
  healthScore: number;
}

interface ActiveGame {
  id: string; status: string; startedAt?: string;
}

interface QRData {
  claimUrl: string;
  coinsAwarded: number;
  multiplierApplied: number;
  expiresAt: string;
  expiresInSeconds: number;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const card = {
  background: '#1A2942',
  border: '1px solid rgba(201,146,42,0.2)',
  borderRadius: '16px',
};
const cardGreen = {
  background: 'rgba(34,197,94,0.08)',
  border: '1px solid rgba(34,197,94,0.3)',
  borderRadius: '16px',
};

// ─── Composant ────────────────────────────────────────────────────────────────

export default function GerantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bar, setBar] = useState<BarInfo | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);
  const [stats, setStats] = useState<SessionStats>({ coinsDistributed: 0, transactionCount: 0, playerCount: 0 });
  const [loading, setLoading] = useState(true);

  // QR génération
  const [amount, setAmount] = useState('');
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(0);
  const [qrLoading, setQrLoading] = useState(false);

  const barId = session?.user?.barId;

  const fetchDashboard = useCallback(async () => {
    if (!barId) return;
    try {
      const res = await fetch(`/api/bars/${barId}/session`);
      if (!res.ok) return;
      const data = await res.json();
      setBar(data.bar);
      setActiveGame(data.activeGame);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  }, [barId]);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status !== 'authenticated') return;
    if (!['OWNER', 'MANAGER'].includes(session?.user?.role as string ?? '')) {
      router.push('/dashboard');
      return;
    }
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000); // refresh toutes les 30s
    return () => clearInterval(interval);
  }, [status, session, router, fetchDashboard]);

  // Countdown QR
  useEffect(() => {
    if (!qrData) return;
    const expires = new Date(qrData.expiresAt).getTime();
    const tick = setInterval(() => {
      const left = Math.max(0, Math.round((expires - Date.now()) / 1000));
      setQrSecondsLeft(left);
      if (left === 0) { setQrData(null); clearInterval(tick); }
    }, 1000);
    setQrSecondsLeft(qrData.expiresInSeconds);
    return () => clearInterval(tick);
  }, [qrData]);

  async function handleLaunchSession() {
    if (!barId) return;
    const res = await fetch(`/api/bars/${barId}/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    if (res.ok) fetchDashboard();
  }

  async function handleEndSession() {
    if (!barId || !confirm('Terminer la soirée ?')) return;
    await fetch(`/api/bars/${barId}/session`, { method: 'DELETE' });
    fetchDashboard();
  }

  async function handleGenerateQR(e: React.FormEvent) {
    e.preventDefault();
    if (!barId || !amount) return;
    setQrLoading(true);
    setQrData(null);
    try {
      const res = await fetch(`/api/bars/${barId}/qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (res.ok) setQrData(data);
    } finally {
      setQrLoading(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2E' }}>
        <div className="text-5xl animate-pulse">⚡</div>
      </div>
    );
  }

  const multLabel = '×1 → ×4';  // paliers sur le montant de la note (business-rules.ts)
  const sessionActive = activeGame?.status === 'ACTIVE';

  return (
    <div className="min-h-screen pb-10 px-4" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 100%)' }}>

      {/* Header */}
      <div className="pt-10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black" style={{ color: '#C9922A' }}>Bar⚡Coins</h1>
          <p className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Dashboard Gérant — {bar?.name ?? '…'}</p>
        </div>
        <button onClick={() => signOut()} className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
          Déconnexion
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {/* Stats soirée */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Joueurs', value: stats.playerCount, icon: '👥' },
            { label: 'Transactions', value: stats.transactionCount, icon: '🔄' },
            { label: 'Points dist.', value: stats.coinsDistributed.toLocaleString(), icon: '⚡' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-center" style={card}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xl font-black" style={{ color: '#F2C96B' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Lancer / terminer soirée */}
        <div className="rounded-2xl p-5" style={sessionActive ? cardGreen : card}>
          <div className="flex items-center gap-2 mb-3">
            {sessionActive && <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#22C55E', animation: 'pulse-live 1.5s infinite' }}></span>}
            <h2 className="font-bold text-base" style={{ color: sessionActive ? '#22C55E' : '#F5F0E8' }}>
              {sessionActive ? 'Soirée en cours' : 'Pas de soirée active'}
            </h2>
          </div>

          {sessionActive ? (
            <div className="space-y-3">
              <p className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>
                Multiplicateur actif : <strong style={{ color: '#C9922A' }}>{multLabel}</strong>
                {bar?.boostActive && <span style={{ color: '#E8860A' }}> (BOOST ×2)</span>}
              </p>
              <button onClick={handleEndSession}
                className="w-full py-3 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.4)' }}>
                Terminer la soirée
              </button>
            </div>
          ) : (
            <button onClick={handleLaunchSession}
              className="w-full py-4 rounded-xl font-black text-lg transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #C9922A 0%, #E8860A 50%, #F2C96B 100%)',
                boxShadow: '0 4px 24px rgba(232,134,10,0.5)',
                color: '#0D1B2E',
              }}>
              🚀 Lancer la soirée
            </button>
          )}
        </div>

        {/* Générateur QR */}
        <div className="rounded-2xl p-5" style={card}>
          <h2 className="font-bold text-base mb-1" style={{ color: '#F5F0E8' }}>Générer un QR Code</h2>
          <p className="text-xs mb-4" style={{ color: 'rgba(245,240,232,0.5)' }}>
            Saisis le montant de la conso — le joueur scanne pour recevoir ses points
          </p>

          <form onSubmit={handleGenerateQR} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <input
                type="number" step="0.5" min="0.5" max="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 14.50"
                className="w-full rounded-xl px-4 py-3 text-lg font-bold outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,146,42,0.3)', color: '#F5F0E8' }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'rgba(245,240,232,0.5)' }}>€</span>
            </div>
            <button type="submit" disabled={qrLoading || !amount}
              className="px-5 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C9922A, #E8860A)', color: '#0D1B2E' }}>
              {qrLoading ? '…' : 'QR'}
            </button>
          </form>

          {/* Aperçu QR */}
          {qrData && (
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}>
              {/* QR Code — affiché via URL encodée en QR (librairie à brancher) */}
              <div className="w-40 h-40 mx-auto rounded-xl mb-3 flex items-center justify-center text-4xl"
                style={{ background: 'white' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData.claimUrl)}`}
                  alt="QR Code"
                  className="w-full h-full rounded-xl"
                />
              </div>
              <p className="font-black text-lg" style={{ color: '#22C55E' }}>+{qrData.coinsAwarded} Bcoins</p>
              <p className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Multiplicateur ×{qrData.multiplierApplied}</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className={`text-sm font-bold ${qrSecondsLeft < 20 ? 'text-red-400' : ''}`}
                  style={{ color: qrSecondsLeft < 20 ? '#EF4444' : '#E8860A' }}>
                  ⏱ {qrSecondsLeft}s
                </div>
                {qrSecondsLeft < 20 && <span className="text-xs text-red-400">Expire bientôt !</span>}
              </div>
            </div>
          )}
        </div>

        {/* Plan & multiplicateur */}
        <div className="rounded-2xl p-4" style={card}>
          <h2 className="font-bold text-sm mb-3" style={{ color: 'rgba(245,240,232,0.7)' }}>Plan actif</h2>
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2 py-1 rounded-lg text-xs font-black"
                style={{ background: 'rgba(201,146,42,0.2)', color: '#C9922A' }}>
                {bar?.plan ?? '…'}
              </span>
              <span className="ml-3 text-sm" style={{ color: '#F5F0E8' }}>Multiplicateur {multLabel}</span>
              {bar?.boostActive && (
                <span className="ml-2 text-xs font-bold" style={{ color: '#E8860A' }}>BOOST ×2 ACTIF</span>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Health Score</div>
              <div className="text-lg font-black" style={{ color: (bar?.healthScore ?? 0) >= 70 ? '#22C55E' : (bar?.healthScore ?? 0) >= 40 ? '#E8860A' : '#EF4444' }}>
                {bar?.healthScore ?? 0}/100
              </div>
            </div>
          </div>
        </div>

        {/* Accès classement écran */}
        <button onClick={() => router.push('/leaderboard')}
          className="w-full rounded-2xl p-4 flex items-center gap-3"
          style={{ ...card, border: '1px solid rgba(201,146,42,0.4)' }}>
          <span className="text-3xl">📺</span>
          <div className="flex-1 text-left">
            <div className="text-[#F5F0E8] font-bold text-sm">Afficher le classement</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Passer sur l&apos;écran du bar</div>
          </div>
          <span style={{ color: '#C9922A' }}>→</span>
        </button>

      </div>
    </div>
  );
}
