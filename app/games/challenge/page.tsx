'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type GameType = 'blindtest' | 'quiz'
type Step = 'type' | 'players' | 'config' | 'waiting' | 'ready'

const nearbyPlayers = [
  { id: 1, name: 'Julie R.', initials: 'JR', status: 'online' },
  { id: 2, name: 'Thomas B.', initials: 'TB', status: 'online' },
  { id: 3, name: 'Sébastien M.', initials: 'SM', status: 'online' },
  { id: 4, name: 'Amandine C.', initials: 'AC', status: 'online' },
  { id: 5, name: 'Lucas D.', initials: 'LD', status: 'busy' },
  { id: 6, name: 'Camille T.', initials: 'CT', status: 'online' },
]

const categories: Record<GameType, string[]> = {
  blindtest: ['Années 90', 'Années 2000', 'Hits actuels', 'Rock classique', 'Variété française', 'Mix toutes époques'],
  quiz: ['Culture bar & alcools', 'Pop culture', 'Sport', 'Cinéma', 'Géographie', 'Mix surprise'],
}

const ACCESS_FEE = 10 // coins d'accès par défi

export default function Challenge() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('type')
  const [gameType, setGameType] = useState<GameType>('blindtest')
  const [category, setCategory] = useState('')
  const [selected, setSelected] = useState<number[]>([])
  const [bet, setBet] = useState(50)
  const [waitCount, setWaitCount] = useState(1)
  const myCoins = 1247

  const totalInvited = selected.length
  const accessPerPerson = totalInvited > 0 ? Math.ceil(ACCESS_FEE / (totalInvited + 1)) : ACCESS_FEE
  const totalCost = accessPerPerson + bet

  function togglePlayer(id: number) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  function startWaiting() {
    setStep('waiting')
    // Simulate players joining
    let joined = 1
    const t = setInterval(() => {
      joined++
      setWaitCount(joined)
      if (joined >= selected.length + 1) {
        clearInterval(t)
        setTimeout(() => setStep('ready'), 800)
      }
    }, 1200)
  }

  if (step === 'type') return (
    <div className="min-h-dvh flex flex-col px-4 pt-12" style={{background:'linear-gradient(160deg,#1a0a00,#2d1200)'}}>
      <button onClick={() => router.back()} className="text-[#F5E6D3]/40 text-sm mb-6">← Retour</button>
      <div className="text-4xl mb-3">⚔️</div>
      <h1 className="text-[#F5E6D3] text-2xl font-black mb-1">Créer un défi privé</h1>
      <p className="text-[#F5E6D3]/50 text-sm mb-8">Challenge ta table — sans attendre le bar</p>

      <div className="text-[#F5E6D3]/60 text-xs font-bold uppercase tracking-wider mb-3">Choisir le jeu</div>
      <div className="flex flex-col gap-3 mb-6">
        {(['blindtest', 'quiz'] as GameType[]).map(type => (
          <button key={type} onClick={() => { setGameType(type); setCategory('') }}
            className="rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-95"
            style={{background: gameType === type ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
              border: gameType === type ? '2px solid #F59E0B' : '2px solid transparent'}}>
            <span className="text-3xl">{type === 'blindtest' ? '🎵' : '❓'}</span>
            <div className="text-left">
              <div className="text-[#F5E6D3] font-bold">{type === 'blindtest' ? 'Blind Test' : 'Quiz Bar'}</div>
              <div className="text-[#F5E6D3]/50 text-xs">{type === 'blindtest' ? 'Mise avant d\'écouter — Qui reconnaît le plus ?' : 'Questions culture & boissons'}</div>
            </div>
            {gameType === type && <span className="ml-auto text-lg">✅</span>}
          </button>
        ))}
      </div>

      <div className="text-[#F5E6D3]/60 text-xs font-bold uppercase tracking-wider mb-3">Catégorie</div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories[gameType].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{background: category === cat ? '#F59E0B' : 'rgba(255,255,255,0.1)',
              color: category === cat ? '#1a0a00' : '#F5E6D3'}}>
            {cat}
          </button>
        ))}
      </div>

      <button onClick={() => category && setStep('players')}
        className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 mt-auto mb-6"
        style={{background: category ? '#F59E0B' : 'rgba(255,255,255,0.1)', color: category ? '#1a0a00' : 'rgba(245,230,211,0.3)'}}>
        Choisir les joueurs →
      </button>
    </div>
  )

  if (step === 'players') return (
    <div className="min-h-dvh flex flex-col px-4 pt-12" style={{background:'linear-gradient(160deg,#1a0a00,#2d1200)'}}>
      <button onClick={() => setStep('type')} className="text-[#F5E6D3]/40 text-sm mb-4">← Retour</button>
      <h2 className="text-[#F5E6D3] text-xl font-black mb-1">Qui défies-tu ?</h2>
      <p className="text-[#F5E6D3]/50 text-sm mb-6">Joueurs présents au bar ce soir</p>

      <div className="flex flex-col gap-2 mb-6">
        {nearbyPlayers.map(p => (
          <button key={p.id} onClick={() => p.status === 'online' && togglePlayer(p.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
            style={{background: selected.includes(p.id) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
              border: selected.includes(p.id) ? '2px solid #F59E0B' : '2px solid transparent',
              opacity: p.status === 'busy' ? 0.4 : 1}}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{background: selected.includes(p.id) ? '#F59E0B' : 'rgba(255,255,255,0.15)',
                color: selected.includes(p.id) ? '#1a0a00' : '#F5E6D3'}}>
              {p.initials}
            </div>
            <div className="flex-1 text-left">
              <div className="text-[#F5E6D3] font-medium text-sm">{p.name}</div>
              <div className="text-xs" style={{color: p.status === 'online' ? '#22c55e' : '#9ca3af'}}>
                {p.status === 'online' ? '● Disponible' : '● En jeu'}
              </div>
            </div>
            {selected.includes(p.id) && <span className="text-lg">✅</span>}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="rounded-2xl p-3 mb-4" style={{background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)'}}>
          <div className="text-[#F5E6D3]/60 text-xs text-center">
            {selected.length + 1} joueurs · Accès : <strong style={{color:'#F59E0B'}}>{accessPerPerson} Bcoins/pers.</strong> (total {ACCESS_FEE} Bcoins partagés)
          </div>
        </div>
      )}

      <button onClick={() => selected.length > 0 && setStep('config')}
        className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 mb-6"
        style={{background: selected.length > 0 ? '#F59E0B' : 'rgba(255,255,255,0.1)',
          color: selected.length > 0 ? '#1a0a00' : 'rgba(245,230,211,0.3)'}}>
        {selected.length > 0 ? `Configurer le défi (${selected.length + 1} joueurs) →` : 'Sélectionne au moins 1 joueur'}
      </button>
    </div>
  )

  if (step === 'config') return (
    <div className="min-h-dvh flex flex-col px-4 pt-12" style={{background:'linear-gradient(160deg,#1a0a00,#2d1200)'}}>
      <button onClick={() => setStep('players')} className="text-[#F5E6D3]/40 text-sm mb-4">← Retour</button>
      <h2 className="text-[#F5E6D3] text-xl font-black mb-1">Paramètres du défi</h2>
      <p className="text-[#F5E6D3]/50 text-sm mb-6">{gameType === 'blindtest' ? '🎵' : '❓'} {category} · {selected.length + 1} joueurs</p>

      {/* Récap frais d'accès */}
      <div className="rounded-2xl p-4 mb-6" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="text-[#F5E6D3]/60 text-xs font-bold uppercase tracking-wider mb-3">Frais d'accès (partagés)</div>
        <div className="flex justify-between items-center">
          <div className="text-[#F5E6D3]/70 text-sm">Total accès défi</div>
          <div className="font-bold" style={{color:'#F59E0B'}}>{ACCESS_FEE} Bcoins</div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-[#F5E6D3]/70 text-sm">Ta part ({selected.length + 1} joueurs)</div>
          <div className="font-bold text-[#F5E6D3]">{accessPerPerson} Bcoins</div>
        </div>
        <div className="text-[#F5E6D3]/30 text-xs mt-2">Ces Bcoins alimentent le jackpot du défi 🏆</div>
      </div>

      {/* Mise supplémentaire */}
      <div className="text-[#F5E6D3]/60 text-xs font-bold uppercase tracking-wider mb-3">Ta mise supplémentaire (optionnel)</div>
      <div className="rounded-2xl p-6 mb-6" style={{background:'rgba(255,255,255,0.05)'}}>
        <div className="flex items-center justify-center gap-4 mb-3">
          <button onClick={() => setBet(b => Math.max(0, b - 25))}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
            style={{background:'rgba(255,255,255,0.1)',color:'#fff'}}>-</button>
          <span className="text-4xl font-black" style={{color:'#F59E0B'}}>{bet}</span>
          <button onClick={() => setBet(b => Math.min(500, b + 25))}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
            style={{background:'rgba(255,255,255,0.1)',color:'#fff'}}>+</button>
        </div>
        <div className="text-center text-[#F5E6D3]/40 text-xs">Mise supplémentaire · Le gagnant empoche tout</div>
      </div>

      {/* Total */}
      <div className="rounded-2xl p-4 mb-6" style={{background:'rgba(245,158,11,0.15)', border:'1px solid #F59E0B'}}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[#F5E6D3]/70 text-sm">Coût total pour toi</span>
          <span className="text-2xl font-black" style={{color:'#F59E0B'}}>{totalCost} Bcoins</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#F5E6D3]/50 text-xs">Ton solde après</span>
          <span className="text-[#F5E6D3]/60 text-sm">{myCoins - totalCost} coins</span>
        </div>
      </div>

      <button onClick={startWaiting}
        className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 mb-6"
        style={{background:'#F59E0B', color:'#1a0a00'}}>
        ⚔️ Lancer le défi !
      </button>
    </div>
  )

  if (step === 'waiting') return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4"
      style={{background:'linear-gradient(160deg,#1a0a00,#2d1200)'}}>
      <div className="text-5xl mb-6">⚔️</div>
      <h2 className="text-[#F5E6D3] text-2xl font-black mb-2">Défi envoyé !</h2>
      <p className="text-[#F5E6D3]/50 text-sm mb-8 text-center">En attente que tes adversaires rejoignent...</p>

      <div className="w-full max-w-sm flex flex-col gap-3 mb-8">
        {/* Toi */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{background:'rgba(245,158,11,0.15)', border:'1px solid #F59E0B'}}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{background:'#F59E0B',color:'#1a0a00'}}>AM</div>
          <span className="text-[#F5E6D3] font-medium flex-1">Alexandre M. (toi)</span>
          <span className="text-green-400 text-xs font-bold">✓ Prêt</span>
        </div>
        {/* Adversaires */}
        {selected.map((id, i) => {
          const p = nearbyPlayers.find(x => x.id === id)!
          const joined = i < waitCount - 1
          return (
            <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                style={{background: joined ? '#22c55e' : 'rgba(255,255,255,0.15)', color: joined ? '#fff' : '#fff'}}>
                {p?.initials}
              </div>
              <span className="text-[#F5E6D3] font-medium flex-1">{p?.name}</span>
              {joined ? (
                <span className="text-green-400 text-xs font-bold">✓ Rejoint</span>
              ) : (
                <span className="text-[#F5E6D3]/30 text-xs">En attente...</span>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[#F5E6D3]/30 text-xs">Notification envoyée sur leur téléphone</p>
    </div>
  )

  // step === 'ready'
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{background:'linear-gradient(160deg,#1a0a00,#2d1200)'}}>
      <div className="text-6xl mb-4 slide-up">⚔️</div>
      <h2 className="text-[#F5E6D3] text-3xl font-black mb-2">Tout le monde est prêt !</h2>
      <p className="text-[#F5E6D3]/60 mb-2">{gameType === 'blindtest' ? '🎵 Blind Test' : '❓ Quiz'} · {category}</p>
      <p className="text-[#F5E6D3]/50 text-sm mb-8">{selected.length + 1} joueurs · Mise totale : {(bet * (selected.length + 1)) + ACCESS_FEE} Bcoins</p>

      <div className="w-full max-w-sm rounded-2xl p-4 mb-8" style={{background:'rgba(245,158,11,0.15)', border:'1px solid #F59E0B'}}>
        <div className="text-center text-[#F5E6D3]/60 text-sm mb-2">Jackpot du défi</div>
        <div className="text-center text-5xl font-black" style={{color:'#F59E0B'}}>
          {(bet * (selected.length + 1)) + ACCESS_FEE}
          <span className="text-xl ml-1">Bcoins</span>
        </div>
        <div className="text-center text-[#F5E6D3]/40 text-xs mt-1">Le gagnant emporte tout 🏆</div>
      </div>

      <button onClick={() => router.push(gameType === 'blindtest' ? '/games/blindtest' : '/games/quiz')}
        className="w-full py-4 rounded-2xl font-bold text-xl transition-transform active:scale-95 pulse-gold mb-4"
        style={{background:'#F59E0B', color:'#1a0a00'}}>
        🚀 Commencer le défi !
      </button>
      <button onClick={() => router.push('/games')} className="text-[#F5E6D3]/40 text-sm">Annuler</button>
    </div>
  )
}
