'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSSE } from '@/hooks/useSSE';
import BottomNav from '@/components/BottomNav';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalCoins: number;
}

interface LeaderboardData {
  barId: string;
  type: string;
  leaderboard: LeaderboardEntry[];
  updatedAt: string;
}

interface SSEUpdate {
  type: string;
  leaderboard?: LeaderboardEntry[];
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Leaderboard() {
  const { data: session } = useSession();
  const barId = session?.user?.barId;
  const myUserId = session?.user?.id;

  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    if (!barId) return;
    try {
      const res = await fetch(`/api/bars/${barId}/leaderboard?type=SOIREE&limit=20`);
      if (!res.ok) return;
      const data: LeaderboardData = await res.json();
      setPlayers(data.leaderboard);
    } finally {
      setLoading(false);
    }
  }, [barId]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  // SSE real-time updates
  const sseUrl = barId ? `/api/bars/${barId}/leaderboard/stream` : '';
  const { data: sseData, connected } = useSSE<SSEUpdate>(sseUrl, { enabled: !!barId });

  useEffect(() => {
    if (sseData?.leaderboard) {
      setPlayers(sseData.leaderboard);
      setLoading(false);
    }
  }, [sseData]);

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  const me = players.find(p => p.userId === myUserId);
  const first = players[0];
  const gapTo1st = me && (me.rank ?? 1) > 1 ? (first?.totalCoins ?? 0) - (me?.totalCoins ?? 0) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2E' }}>
        <div className="text-5xl animate-pulse">🏆</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>
        <div className="px-4 pt-12 pb-2">
          <h1 className="text-xl font-black" style={{ color: '#F5F0E8' }}>Classement — Ce Soir</h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
          <div className="text-6xl">🏆</div>
          <p className="text-center px-8" style={{ color: 'rgba(245,240,232,0.5)' }}>
            Pas encore de joueurs ce soir. Scanne un QR code pour entrer dans le classement !
          </p>
        </div>
        <BottomNav active="leaderboard" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-xl font-black" style={{ color: '#F5F0E8', textShadow: '0 0 16px rgba(201,146,42,0.3)' }}>Classement — Ce Soir</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: connected ? '#22C55E' : '#E8860A', animation: 'pulse 1.5s infinite' }}></span>
          <span className="text-xs font-medium" style={{ color: connected ? '#22C55E' : '#E8860A' }}>
            {connected ? 'Live — mise à jour en temps réel' : 'Mise à jour toutes les 30s'}
          </span>
        </div>
      </div>

      {/* Bannière gap to 1st */}
      {gapTo1st > 0 && (
        <div className="mx-4 mt-3 rounded-xl px-4 py-2 flex items-center gap-2"
          style={{ background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.4)' }}>
          <span className="text-lg">🎯</span>
          <span className="text-sm" style={{ color: '#C9922A' }}>
            Il te manque <strong>{gapTo1st} Bcoins</strong> pour prendre la 1ère place !
          </span>
        </div>
      )}
      {me && me.rank === 1 && (
        <div className="mx-4 mt-3 rounded-xl px-4 py-2 flex items-center gap-2"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)' }}>
          <span className="text-lg">🥇</span>
          <span className="text-sm font-bold" style={{ color: '#22C55E' }}>Tu mènes la soirée ! Continue comme ça !</span>
        </div>
      )}

      {/* Podium top 3 */}
      {top3.length >= 2 && (
        <div className="px-4 py-6 flex items-end justify-center gap-3">
          {[top3[1], top3[0], top3[2]].map((p, i) => {
            if (!p) return <div key={i} className="w-24" />;
            const podiumHeights = [70, 90, 55];
            const avatarSizes   = [60, 72, 60];
            const isCenter      = i === 1;
            const medals        = ['🥈', '👑', '🥉'];
            const borderColors  = ['#C0C0C0', '#C9922A', '#CD7F32'];
            const podiumBg = [
              'linear-gradient(180deg, #A0A0A0 0%, #808080 100%)',
              'linear-gradient(180deg, #C9922A 0%, #E8860A 100%)',
              'linear-gradient(180deg, #8B5A2B 0%, #6B3F1B 100%)',
            ];
            const isMe = p.userId === myUserId;

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <span style={{
                  fontSize: isCenter ? '28px' : '22px',
                  filter: isCenter ? 'drop-shadow(0 0 8px rgba(201,146,42,0.7))' : 'none'
                }}>{medals[i]}</span>

                <div style={{
                  width: `${avatarSizes[i]}px`, height: `${avatarSizes[i]}px`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 'bold',
                  fontSize: isCenter ? '18px' : '14px',
                  background: isMe
                    ? 'linear-gradient(135deg, #C9922A, #E8860A)'
                    : isCenter ? 'rgba(201,146,42,0.25)' : 'rgba(255,255,255,0.1)',
                  color: isMe ? '#0F1923' : '#F5F0E8',
                  border: `3px solid ${borderColors[i]}`,
                  boxShadow: isCenter
                    ? '0 0 0 6px rgba(201,146,42,0.2), 0 0 30px rgba(201,146,42,0.3)'
                    : 'none',
                }}>
                  {initials(p.displayName)}
                </div>

                <div style={{
                  width: '80px', height: `${podiumHeights[i]}px`,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '2px',
                  background: podiumBg[i],
                  boxShadow: isCenter
                    ? '0 0 0 4px rgba(201,146,42,0.15), 0 0 25px rgba(201,146,42,0.4)'
                    : 'none',
                }}>
                  <div style={{ color: isCenter ? '#0F1923' : '#F5F0E8', fontSize: '11px', fontWeight: 900 }}>
                    {p.displayName.split(' ')[0]}
                  </div>
                  <div style={{
                    color: isCenter ? '#0F1923' : '#F5F0E8',
                    fontSize: isCenter ? '16px' : '14px',
                    fontWeight: 900
                  }}>
                    {p.totalCoins.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reste du classement */}
      <div className="mx-4 rounded-2xl overflow-hidden"
        style={{ background: '#1A2942', border: '1px solid rgba(201,146,42,0.12)' }}>
        {rest.map((p) => {
          const isMe = p.userId === myUserId;
          return (
            <div key={p.userId} className="flex items-center gap-3 px-4 py-3 border-b"
              style={{
                borderColor: 'rgba(201,146,42,0.08)',
                background: isMe ? 'rgba(201,146,42,0.12)' : 'transparent',
                borderLeft: isMe ? '3px solid #C9922A' : '3px solid transparent',
              }}>
              <span className="w-5 text-sm font-bold" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.rank}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: isMe ? 'linear-gradient(135deg, #C9922A, #E8860A)' : 'rgba(255,255,255,0.08)',
                  color: isMe ? '#0F1923' : '#F5F0E8',
                }}>
                {initials(p.displayName)}
              </div>
              <span className="flex-1 text-sm font-medium" style={{ color: isMe ? '#C9922A' : '#F5F0E8' }}>
                {p.displayName}{isMe ? ' (toi)' : ''}
              </span>
              <span className="font-bold text-sm" style={{ color: isMe ? '#E8860A' : '#C9922A' }}>
                {p.totalCoins.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      <BottomNav active="leaderboard" />
    </div>
  );
}
