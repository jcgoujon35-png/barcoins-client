'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PLAYER_STATUS_THRESHOLDS } from '@/config/business-rules';
import BottomNav from '@/components/BottomNav';

interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  phone: string;
  createdAt: string;
}

interface BarClient {
  playBalance: number;
  fideliteBalance: number;
  totalCoinsEarned: number;
  joinedAt?: string;
}

interface Bar {
  name: string;
  slug: string;
}

interface MeResponse {
  user: UserProfile;
  barClient: BarClient;
  bar: Bar | null;
}

const recompenses = [
  { icon: '🍺', label: 'Demi offert', coins: 500 },
  { icon: '🥂', label: 'Cocktail offert', coins: 1200 },
  { icon: '🍕', label: 'Planche offerte', coins: 1500 },
  { icon: '🎁', label: 'Soirée VIP', coins: 5000 },
];

const comingSoon = [
  { icon: '🛒', label: 'Achat de Bcoins', desc: 'Recharge ton solde en ligne' },
  { icon: '🎁', label: 'Cadeaux & bons', desc: 'Échange tes Bcoins contre des réductions' },
  { icon: '🌍', label: 'Multi-bars V2', desc: 'Tes Bcoins valables partout' },
  { icon: '⚽', label: 'Paris sportifs', desc: 'Miser sur le match en cours' },
  { icon: '🎰', label: 'Roue de la Fortune', desc: 'Bientôt disponible' },
  { icon: '🏅', label: 'Championnats', desc: 'Tournois inter-bars mensuels' },
];

const glassCard = { background: '#1A2942', border: '1px solid rgba(201,146,42,0.15)' };
const glassCardSubtle = { background: '#162035', border: '1px solid rgba(201,146,42,0.10)' };

function getStatus(totalCoins: number): string {
  if (totalCoins >= PLAYER_STATUS_THRESHOLDS.LEGEND) return 'LEGEND 🌟';
  if (totalCoins >= PLAYER_STATUS_THRESHOLDS.VIP) return 'VIP ⭐';
  return 'REGULAR';
}

function getNextStatus(totalCoins: number): { label: string; threshold: number } | null {
  if (totalCoins < PLAYER_STATUS_THRESHOLDS.VIP) return { label: 'VIP', threshold: PLAYER_STATUS_THRESHOLDS.VIP };
  if (totalCoins < PLAYER_STATUS_THRESHOLDS.LEGEND) return { label: 'LEGEND', threshold: PLAYER_STATUS_THRESHOLDS.LEGEND };
  return null;
}

function displayName(user: UserProfile): string {
  if (user.nickname) return user.nickname;
  if (user.firstName) return user.firstName + (user.lastName ? ` ${user.lastName[0]}.` : '');
  return 'Joueur';
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function memberSince(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status !== 'authenticated') return;
    fetch('/api/user/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProfile(data); })
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2E' }}>
        <div className="text-5xl animate-pulse">⚡</div>
      </div>
    );
  }

  // Fallback to session data if API unavailable
  const user = profile?.user;
  const barClient = profile?.barClient ?? { playBalance: 0, fideliteBalance: 0, totalCoinsEarned: 0 };
  const bar = profile?.bar;

  const name = user ? displayName(user) : (session?.user?.name ?? 'Joueur');
  const initStr = initials(name);
  const coinsPlay = barClient.playBalance;
  const coinsFidelite = barClient.fideliteBalance;
  const totalEarned = barClient.totalCoinsEarned;
  const status_ = getStatus(totalEarned);
  const next = getNextStatus(totalEarned);
  const progressPct = next ? Math.min(100, (totalEarned / next.threshold) * 100) : 100;
  const fideliteProgress = Math.min(100, (coinsFidelite / 2000) * 100);

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>
      {/* Hero */}
      <div className="px-4 pt-12 pb-6 text-center" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-3"
          style={{ background: '#E8860A', color: '#F5F0E8', border: '3px solid #C9922A', boxShadow: '0 0 0 4px rgba(201,146,42,0.15), 0 0 24px rgba(201,146,42,0.4)' }}>
          {initStr}
        </div>
        <div className="text-xl font-black" style={{ color: '#F5F0E8', textShadow: '0 0 16px rgba(201,146,42,0.25)' }}>{name}</div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 mb-4"
          style={{ background: 'transparent', color: '#C9922A', border: '1px solid rgba(201,146,42,0.6)' }}>{status_}</div>

        {/* Deux types de coins */}
        <div className="flex gap-3 justify-center">
          <div className="flex-1 rounded-2xl px-3 py-2"
            style={{ background: 'rgba(232,134,10,0.12)', border: '1px solid rgba(232,134,10,0.4)' }}>
            <div className="text-3xl font-black" style={{ color: '#C9922A', textShadow: '0 0 20px rgba(201,146,42,0.6)' }}>{coinsPlay.toLocaleString()}</div>
            <div className="text-[#F5F0E8]/50 text-xs">⚡ Bcoins Play</div>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)' }}>
            <div className="text-3xl font-black" style={{ color: '#22C55E' }}>{coinsFidelite.toLocaleString()}</div>
            <div className="text-[#F5F0E8]/50 text-xs">🎁 Bcoins Fidélité</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">

        {/* Coins Fidélité + récompenses */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-sm" style={{ color: 'rgba(245,240,232,0.7)' }}>🎁 Bcoins Fidélité</div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>Beta</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>Solde fidélité</span>
            <span className="text-xl font-black" style={{ color: '#22C55E' }}>{coinsFidelite} 🎁</span>
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{ background: 'rgba(245,240,232,0.1)' }}>
            <div className="h-2 rounded-full" style={{ width: `${fideliteProgress}%`, background: '#22C55E' }}></div>
          </div>
          <div className="text-xs mb-4" style={{ color: 'rgba(245,240,232,0.5)' }}>
            {coinsFidelite} / 2 000 pour un <strong className="text-[#F5F0E8]">demi offert</strong>
          </div>

          <div className="font-bold text-xs mb-2" style={{ color: 'rgba(245,240,232,0.7)' }}>Récompenses disponibles</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recompenses.map((r, i) => {
              const dispo = coinsFidelite >= r.coins;
              return (
                <div key={i} className="flex-shrink-0 rounded-xl p-3 w-28 text-center"
                  style={{
                    background: dispo ? 'rgba(34,197,94,0.12)' : '#162035',
                    border: dispo ? '1.5px solid #22C55E' : '1px solid rgba(255,255,255,0.08)',
                    opacity: dispo ? 1 : 0.55
                  }}>
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-xs font-bold text-[#F5F0E8]">{r.label}</div>
                  <div className="text-xs font-black mt-1" style={{ color: dispo ? '#22C55E' : 'rgba(245,240,232,0.5)' }}>{r.coins.toLocaleString()} 🎁</div>
                  {dispo && <div className="text-xs font-bold mt-1" style={{ color: '#22C55E' }}>Disponible !</div>}
                </div>
              );
            })}
          </div>
          <div className="text-xs mt-3 text-center" style={{ color: 'rgba(245,240,232,0.5)' }}>Coins fidélité = earned à chaque visite, non perdables en jeu</div>
        </div>

        {/* Progression statut */}
        {next && (
          <div className="rounded-2xl p-4" style={glassCard}>
            <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(245,240,232,0.5)' }}>
              <span className="font-bold" style={{ color: '#C9922A' }}>{status_}</span>
              <span className="text-[#F5F0E8]/50">{next.label} 🌟</span>
            </div>
            <div className="w-full rounded-full" style={{ height: '8px', background: 'rgba(245,240,232,0.1)' }}>
              <div style={{ height: '8px', borderRadius: '9999px', width: `${progressPct}%`, background: 'linear-gradient(90deg, #C9922A, #E8860A)', boxShadow: '0 0 8px rgba(201,146,42,0.5)' }}></div>
            </div>
            <div className="text-center text-xs mt-2" style={{ color: 'rgba(245,240,232,0.5)' }}>
              {totalEarned.toLocaleString()} / {next.threshold.toLocaleString()} coins pour {next.label}
            </div>
          </div>
        )}

        {/* Bar favori */}
        {bar && (
          <div className="rounded-2xl p-4 flex items-center gap-3" style={glassCard}>
            <div className="text-2xl">📍</div>
            <div>
              <div className="font-bold text-[#F5F0E8]">{bar.name}</div>
              <div className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>
                Membre depuis {memberSince(barClient.joinedAt)}
              </div>
            </div>
          </div>
        )}

        {/* Coming soon */}
        <div className="rounded-2xl p-4" style={{ ...glassCard, border: '1px solid rgba(201,146,42,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔮</span>
            <span className="text-[#F5F0E8] font-black text-sm">Prochainement sur BarCoins</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(201,146,42,0.2)', color: '#C9922A' }}>V2</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {comingSoon.map((f, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-32" style={glassCardSubtle}>
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-[#F5F0E8] text-xs font-bold leading-tight">{f.label}</div>
                <div className="text-xs mt-1 leading-tight" style={{ color: 'rgba(245,240,232,0.5)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Déconnexion */}
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full py-3 rounded-2xl font-bold text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
          Déconnexion
        </button>

      </div>
      <BottomNav active="profile" />
    </div>
  );
}
