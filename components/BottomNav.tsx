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
      style={{background:'#fff', borderColor:'#e5e7eb', paddingBottom:'env(safe-area-inset-bottom)'}}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => router.push(t.route)}
          className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-all"
          style={{color: active === t.id ? '#F59E0B' : '#9ca3af'}}>
          <span className="text-xl">{t.icon}</span>
          <span className="text-[10px] font-medium">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
