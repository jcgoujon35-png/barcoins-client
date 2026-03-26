'use client'
import { useState } from 'react'
import BottomNav from '@/components/BottomNav'

const transactions = [
  { label: 'Quiz Culture Bar',         coins: '+320', time: 'Hier 21h47',        plus: true  },
  { label: 'Blind Test — Daft Punk',   coins: '+450', time: 'Hier 21h32',        plus: true  },
  { label: 'Consommation 16€',         coins: '+80',  time: 'Hier 21h15',        plus: true  },
  { label: 'Connexion soirée',         coins: '+25',  time: 'Hier 21h00',        plus: true  },
  { label: 'Blind Test — raté',        coins: '-150', time: 'Mer 18/03 22h12',   plus: false },
  { label: 'Quiz — 5/5 parfait !',     coins: '+200', time: 'Mer 18/03 21h50',   plus: true  },
  { label: 'Consommation 22€',         coins: '+110', time: 'Mer 18/03 21h15',   plus: true  },
  { label: 'Parrainage — Sophie L.',   coins: '+100', time: 'Mar 17/03 20h00',   plus: true  },
]

type Filter = 'all' | 'plus' | 'minus'

const glassCard = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(245,158,11,0.15)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}

export default function History() {
  const [filter, setFilter] = useState<Filter>('all')
  const filtered = transactions.filter(t =>
    filter === 'all' || (filter === 'plus' ? t.plus : !t.plus)
  )

  const totalCoins = 4820

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #2d1200 60%, #1a0a00 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-5" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <h1 className="text-xl font-black slide-up" style={{ color: '#F5E6D3', textShadow: '0 0 16px rgba(245,158,11,0.3)' }}>
          Historique
        </h1>
        <div className="text-3xl font-black mt-1 glow-pulse" style={{ color: '#F59E0B' }}>
          {totalCoins.toLocaleString()} coins ⚡
        </div>
      </div>

      <div className="px-4 pt-2">
        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          {(['all', 'plus', 'minus'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
              style={filter === f
                ? { background: 'linear-gradient(135deg, #F59E0B, #FF6B35)', color: '#1a0a00', boxShadow: '0 2px 12px rgba(245,158,11,0.4)' }
                : { background: 'rgba(255,255,255,0.07)', color: '#A07850' }
              }>
              {f === 'all' ? 'Tout' : f === 'plus' ? '+ Gains' : '− Dépenses'}
            </button>
          ))}
        </div>

        {/* Liste transactions */}
        <div className="rounded-2xl overflow-hidden" style={glassCard}>
          {filtered.map((t, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
              style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
              {/* Icône cercle selon brief 1.6 */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base"
                style={{
                  background: t.plus ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
                  color: t.plus ? '#10B981' : '#ef4444',
                  border: `1px solid ${t.plus ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
                }}>
                {t.plus ? '+' : '−'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#F5E6D3' }}>{t.label}</div>
                <div className="text-xs text-[#A07850]">{t.time}</div>
              </div>
              <span className="font-black text-sm flex-shrink-0"
                style={{ color: t.plus ? '#10B981' : '#ef4444', textShadow: t.plus ? '0 0 8px rgba(16,185,129,0.4)' : 'none' }}>
                {t.coins}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="history" />
    </div>
  )
}
