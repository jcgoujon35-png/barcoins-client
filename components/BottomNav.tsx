'use client'
import { useRouter } from 'next/navigation'

type Tab = 'dashboard' | 'leaderboard' | 'games' | 'profile' | 'history'
const tabs: { id: Tab; icon: string; label: string; route: string }[] = [
  { id: 'dashboard', icon: '🏠', label: 'Accueil', route: '/dashboard' },
  { id: 'leaderboard', icon: '🏆', label: 'Classement', route: '/leaderboard' },
  { id: 'games', icon: '🎮', label: 'Jeux', route: '/games' },
  { id: 'profile', icon: '👤', label: 'Profil', route: '/profile' },
  { id: 'history', icon: '📋', label: 'Historique', route: '/history' },
]

export default function BottomNav({ active }: { active: Tab }) {
  const router = useRouter()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex border-t"
      style={{
        background: 'rgba(26,10,0,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgba(245,158,11,0.2)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => router.push(t.route)}
          className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-all"
          style={{ color: active === t.id ? '#F59E0B' : 'rgba(245,230,211,0.35)' }}>
          <span className={`text-xl transition-transform ${active === t.id ? 'scale-110' : ''}`}>{t.icon}</span>
          <span className="text-[10px] font-medium">{t.label}</span>
          {active === t.id && (
            <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: '#F59E0B' }}></span>
          )}
        </button>
      ))}
    </nav>
  )
}
