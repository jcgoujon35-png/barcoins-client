'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import BottomNav from '@/components/BottomNav';
import { PLAYER_STATUS_THRESHOLDS, calculatePlayCoins } from '@/config/business-rules';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  user: { id: string; firstName?: string | null; nickname?: string | null; phone: string };
  barClient: { playBalance: number; fideliteBalance: number; totalCoinsEarned: number };
  bar: { id: string; name: string; plan: string; boostActive: boolean; boostExpiresAt?: string | null } | null;
  recentTransactions: { reason: string; amount: number; createdAt: string }[];
}

interface LeaderboardEntry { rank: number; userId: string; displayName: string; totalCoins: number }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REASON_LABELS: Record<string, string> = {
  QR_SCAN: 'Consommation validée',
  QUIZ_WIN: 'Quiz — Victoire',
  BLIND_TEST_WIN: 'Blind Test — Victoire',
  PVP_WIN: 'Défi privé — Victoire',
  PACK_PURCHASE: 'Pack fidélité',
  REFERRAL: 'Parrainage',
  MANUAL_CREDIT: 'Crédit gérant',
};

function reasonLabel(reason: string): string {
  return REASON_LABELS[reason] ?? reason;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'à l\'instant';
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

// ─── Styles communs ───────────────────────────────────────────────────────────

const glassCard = {
  background: '#1A2942',
  border: '1px solid rgba(201,146,42,0.15)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};
const glassCardSubtle = { background: '#162035', border: '1px solid rgba(201,146,42,0.10)' };

// Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)
const programme = [
  { time: '20h30', label: 'Blind Test années 2000', icon: '🎵' },
  { time: '21h15', label: 'Quiz Culture Bar', icon: '❓' },
  { time: '22h00', label: 'Double XP Bcoins — 30 min', icon: '⚡' },
  { time: '22h30', label: 'Grand classement final', icon: '🏆' },
];

// Produits vedette fixes (TODO : venir de la carte saisie par le gérant)
const produitsBase = [
  { icon: '🍺', label: 'Pinte artisanale', prix: '6€', prixVal: 6 },
  { icon: '🥂', label: 'Pitcher pour 2', prix: '14€', prixVal: 14 },
  { icon: '🍕', label: 'Planche charcuterie', prix: '12€', prixVal: 12 },
  { icon: '🍹', label: 'Cocktail du soir', prix: '9€', prixVal: 9 },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status !== 'authenticated') return;

    // Staff (gérant, barman…) → leur dashboard est /gerant
    const role = session?.user?.role as string | undefined;
    if (role && ['OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN'].includes(role)) {
      router.push('/gerant');
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) return;
        const data: UserData = await res.json();
        setUserData(data);

        // Classement en temps réel pour ce bar
        if (data.bar?.id) {
          const lb = await fetch(`/api/bars/${data.bar.id}/leaderboard?type=SOIREE&limit=100`);
          if (lb.ok) {
            const lbData: { leaderboard: LeaderboardEntry[] } = await lb.json();
            setTotalPlayers(lbData.leaderboard.length);
            const myEntry = lbData.leaderboard.find((e) => e.userId === session?.user?.id);
            if (myEntry) setMyRank(myEntry.rank);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [status, session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2E' }}>
        <div className="text-5xl animate-pulse">⚡</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2E' }}>
        <div className="text-center">
          <p className="text-red-400 mb-4">Erreur de chargement</p>
          <button onClick={() => window.location.reload()} className="text-sm" style={{ color: '#C9922A' }}>Réessayer</button>
        </div>
      </div>
    );
  }

  const { user, barClient, bar, recentTransactions } = userData;

  // Calculs dynamiques depuis les vraies données
  const coins = barClient.playBalance;
  const computedStatus = coins >= PLAYER_STATUS_THRESHOLDS.LEGEND ? 'LEGEND'
    : coins >= PLAYER_STATUS_THRESHOLDS.VIP ? 'VIP' : 'REGULAR';
  const firstName = user.nickname ?? user.firstName ?? user.phone.slice(-4);
  const initials = firstName.slice(0, 2).toUpperCase();
  // TODO: calculer l'écart avec le 1er quand le classement est chargé

  // Produits avec vraie valeur coins — paliers sur le montant de la note
  const produitsVedette = produitsBase.map((p) => ({
    ...p,
    coins: `+${calculatePlayCoins(p.prixVal)} Bcoins`,
  }));

  // Paliers coins calculés dynamiquement
  const paliersCoins = [
    { conso: '5€',  prixVal: 5,  label: 'Soft / café' },
    { conso: '10€', prixVal: 10, label: 'Bière / verre' },
    { conso: '20€', prixVal: 20, label: 'Cocktail + apéro' },
    { conso: '50€', prixVal: 50, label: 'Table complète' },
  ].map((p) => ({ ...p, coins: calculatePlayCoins(p.prixVal) }));

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>

      {/* Header */}
      <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black" style={{ color: '#C9922A' }}>Bar⚡Coins</span>
          <button onClick={() => router.push('/profile')}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #C9922A, #E8860A)', color: '#0F1923' }}>
            {initials}
          </button>
        </div>
        <div className="text-[#F5F0E8]/60 text-sm mb-2">
          Bonsoir, <span className="text-[#F5F0E8] font-bold">{firstName}</span> 👋
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-5xl font-black" style={{ color: '#C9922A' }}>⚡ {coins.toLocaleString()}</div>
            <div className="text-[#F5F0E8]/40 text-xs mt-0.5">Bcoins ce soir</div>
          </div>
          <div className="text-right">
            <div className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1"
              style={{ background: 'rgba(201,146,42,0.2)', color: '#C9922A', border: '1px solid rgba(201,146,42,0.5)' }}>
              ⭐ {computedStatus}
            </div>
            {myRank && myRank > 1 && (
              <div className="text-[#F5F0E8]/50 text-xs">Position <span className="text-[#F5F0E8] font-bold">#{myRank}</span></div>
            )}
            {myRank === 1 && (
              <div className="text-xs font-bold" style={{ color: '#22C55E' }}>🥇 Tu mènes la soirée !</div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 flex flex-col gap-4">

        {/* Soirée active */}
        <div className="rounded-2xl p-4 slide-up" style={{
          background: 'linear-gradient(135deg, #1A2942 0%, #2D1248 100%)',
          border: '1px solid rgba(201,146,42,0.4)',
          boxShadow: '0 8px 32px rgba(201,146,42,0.15)',
        }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#22C55E', animation: 'pulse-live 1.5s infinite' }}></span>
            <span className="text-xs font-bold tracking-wider" style={{ color: '#22C55E' }}>SOIRÉE EN COURS</span>
          </div>
          <div className="text-[#F5F0E8] font-bold text-lg">{bar?.name ?? 'BarCoins'}</div>
          <div className="text-[#F5F0E8]/50 text-sm mb-3">
            {totalPlayers > 0 ? `${totalPlayers} joueurs ce soir` : 'Rejoins la partie'}
          </div>
          <button onClick={() => router.push('/leaderboard')} className="text-sm font-bold" style={{ color: '#C9922A' }}>
            Voir le classement en direct →
          </button>
        </div>

        {/* Position */}
        {myRank && (
          <div className="rounded-2xl p-4 flex items-center justify-between slide-up" style={glassCard}>
            <div>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(245,240,232,0.5)' }}>Ta position ce soir</div>
              <div className="text-5xl font-black" style={{ color: '#F5F0E8' }}>
                {myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : `#${myRank}`}
              </div>
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>sur {totalPlayers} joueurs</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black" style={{ color: '#22C55E' }}>{coins.toLocaleString()}</div>
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>points ce soir</div>
            </div>
          </div>
        )}

        {/* Boost actif — V2 multijoueur */}

        {/* Programme */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(245,240,232,0.5)' }}>📅 Programme ce soir</div>
          {programme.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
              style={{ borderColor: 'rgba(201,146,42,0.1)' }}>
              <div className="text-xs font-bold w-10 flex-shrink-0" style={{ color: '#C9922A' }}>{p.time}</div>
              <span className="text-base">{p.icon}</span>
              <span className="text-sm font-medium text-[#F5F0E8]">{p.label}</span>
            </div>
          ))}
        </div>

        {/* Carte produits */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(245,240,232,0.5)' }}>
            🍽️ Carte ce soir · multiplicateur ×{mult}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {produitsVedette.map((p, i) => (
              <div key={i} className="rounded-xl p-3" style={glassCardSubtle}>
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="text-xs font-bold text-[#F5F0E8]">{p.label}</div>
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.prix}</div>
                <div className="text-xs font-bold mt-1" style={{ color: '#C9922A' }}>{p.coins}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Paliers */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(245,240,232,0.5)' }}>⚡ Points par conso</div>
          <div className="flex flex-col gap-2">
            {paliersCoins.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0"
                style={{ borderColor: 'rgba(201,146,42,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ background: 'rgba(201,146,42,0.15)', color: '#C9922A' }}>{p.conso}</div>
                  <span className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.label}</span>
                </div>
                <span className="font-black text-sm" style={{ color: '#C9922A' }}>+{p.coins} Bcoins</span>
              </div>
            ))}
          </div>
          <div className="text-xs mt-2 text-center" style={{ color: 'rgba(245,240,232,0.5)' }}>
            Le gérant valide ta visite · Les points arrivent instantanément
          </div>
        </div>

        {/* Jeux */}
        <div className="text-xs font-bold uppercase tracking-wider px-1" style={{ color: 'rgba(245,240,232,0.5)' }}>Jeux lancés par le bar</div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => router.push('/games/blindtest')}
            className="rounded-2xl p-4 text-left transition-transform active:scale-95" style={glassCard}>
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-[#F5F0E8] font-bold text-sm">Blind Test</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Mise avant écoute</div>
            <div className="mt-2 text-xs font-bold" style={{ color: '#C9922A' }}>jusqu&apos;à ×5</div>
          </button>
          <button onClick={() => router.push('/games/quiz')}
            className="rounded-2xl p-4 text-left transition-transform active:scale-95" style={glassCard}>
            <div className="text-2xl mb-2">❓</div>
            <div className="text-[#F5F0E8] font-bold text-sm">Quiz Bar</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>500 questions</div>
            <div className="mt-2 text-xs font-bold" style={{ color: '#C9922A' }}>+20 à +100 Bcoins</div>
          </button>
        </div>

        {/* Défi privé */}
        <button onClick={() => router.push('/games/challenge')}
          className="rounded-2xl p-4 flex items-center gap-3 transition-transform active:scale-95"
          style={{ ...glassCard, border: '1.5px solid rgba(201,146,42,0.4)' }}>
          <span className="text-3xl">⚔️</span>
          <div className="flex-1">
            <div className="text-[#F5F0E8] font-bold text-sm">Créer un défi privé</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Challenge ta table entre potes</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #C9922A, #E8860A)', color: '#0D1B2E' }}>Go</div>
        </button>

        {/* Transactions récentes */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(245,240,232,0.5)' }}>Dernières transactions</div>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'rgba(245,240,232,0.4)' }}>
              Pas encore de transactions ce soir
            </p>
          ) : (
            recentTransactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: 'rgba(201,146,42,0.08)' }}>
                <div>
                  <div className="text-sm font-medium text-[#F5F0E8]">{reasonLabel(t.reason)}</div>
                  <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{timeAgo(t.createdAt)}</div>
                </div>
                <span className="font-bold text-sm" style={{ color: t.amount > 0 ? '#22C55E' : '#EF4444' }}>
                  {t.amount > 0 ? `+${t.amount}` : t.amount} Bcoins
                </span>
              </div>
            ))
          )}
          <button onClick={() => router.push('/history')} className="text-xs mt-2 font-medium" style={{ color: '#C9922A' }}>
            Voir tout l&apos;historique →
          </button>
        </div>

        {/* Prochainement */}
        <div className="rounded-2xl p-4" style={{ ...glassCard, border: '1px solid rgba(201,146,42,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span>🔮</span>
            <span className="text-[#F5F0E8] font-black text-sm">Disponible prochainement</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { icon: '🎁', label: 'Points fidélité', desc: 'Échange vs réductions' },
              { icon: '🎰', label: 'Roue de la Fortune', desc: 'Disponible prochainement' },
              { icon: '🌍', label: 'Multi-bars', desc: 'Tes points partout (V2)' },
              { icon: '⚽', label: 'Paris sportifs', desc: 'Sur le match en cours' },
            ].map((f, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-28 text-center" style={glassCardSubtle}>
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-[#F5F0E8] text-xs font-bold leading-tight">{f.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.5)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <BottomNav active="dashboard" />
    </div>
  );
}
