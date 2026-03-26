'use client'
import { useState } from 'react'
import BottomNav from '@/components/BottomNav'

const transactions = [
  { icon: '✅', label: 'Quiz Culture Bar', coins: '+320', time: 'Hier 21h47', plus: true },
  { icon: '✅', label: 'Blind Test — Daft Punk', coins: '+450', time: 'Hier 21h32', plus: true },
  { icon: '✅', label: 'Consommation 16€', coins: '+80', time: 'Hier 21h15', plus: true },
  { icon: '✅', label: 'Connexion soirée', coins: '+25', time: 'Hier 21h00', plus: true },
  { icon: '❌', label: 'Blind Test — raté', coins: '-150', time: 'Mer 18/03 22h12', plus: false },
  { icon: '✅', label: 'Quiz — 5/5 parfait !', coins: '+200', time: 'Mer 18/03 21h50', plus: true },
  { icon: '✅', label: 'Consommation 22€', coins: '+110', time: 'Mer 18/03 21h15', plus: true },
  { icon: '✅', label: 'Parrainage — Sophie L.', coins: '+100', time: 'Mar 17/03 20h00', plus: true },
]

type Filter = 'all' | 'plus' | 'minus'

export default function History() {
  const [filter, setFilter] = useState<Filter>('all')
  const filtered = transactions.filter(t => filter === 'all' || (filter === 'plus' ? t.plus : !t.plus))

  return (
    <div className="min-h-dvh pb-20" style={{background:'#f4f5f7'}}>
      <div className="px-4 pt-12 pb-4" style={{background:'#1a1a2e'}}>
        <h1 className="text-[#F5E6D3] text-xl font-black">Historique</h1>
        <div className="text-2xl font-black mt-1" style={{color:'#F59E0B'}}>4 820 coins ⚡</div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          {(['all','plus','minus'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
              style={filter === f ? {background:'#F59E0B',color:'#1a1a2e'} : {background:'#fff',color:'#6b7280'}}>
              {f === 'all' ? 'Tout' : f === 'plus' ? '+ Gains' : '- Dépenses'}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          {filtered.map((t, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
              <span className="text-lg">{t.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{color:'#1a1a2e'}}>{t.label}</div>
                <div className="text-xs text-[#A07850]">{t.time}</div>
              </div>
              <span className="font-bold text-sm" style={{color: t.plus ? '#22c55e' : '#ef4444'}}>{t.coins}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="history" />
    </div>
  )
}
