'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const tracks = [
  { title: 'Get Lucky', artist: 'Daft Punk', year: 2013, answers: ['Daft Punk', 'Justice', 'Stromae', 'David Guetta'], correct: 0 },
  { title: 'Alors on danse', artist: 'Stromae', year: 2009, answers: ['Vald', 'Stromae', 'Angèle', 'Orelsan'], correct: 1 },
  { title: 'Starboy', artist: 'The Weeknd', year: 2016, answers: ['Drake', 'The Weeknd', 'Kendrick Lamar', 'Post Malone'], correct: 1 },
]

export default function BlindTest() {
  const router = useRouter()
  const [step, setStep] = useState<'bet'|'listen'|'result'>('bet')
  const [bet, setBet] = useState(150)
  const [timer, setTimer] = useState(30)
  const [selected, setSelected] = useState<number|null>(null)
  const [coins, setCoins] = useState(1247)
  const [tIndex, setTIndex] = useState(0)
  const [blocked, setBlocked] = useState(true)

  useEffect(() => {
    if (step !== 'listen') return
    if (timer === 0) { if (selected === null) setStep('result'); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, step, selected])

  useEffect(() => {
    if (step === 'listen') {
      setBlocked(true)
      const t = setTimeout(() => setBlocked(false), 8000)
      return () => clearTimeout(t)
    }
  }, [step, tIndex])

  const track = tracks[tIndex]
  const won = selected === track.correct

  function choose(i: number) {
    if (selected !== null || blocked) return
    setSelected(i)
    const earned = i === track.correct ? bet * 3 : -bet
    setCoins(c => Math.max(0, c + earned))
    setTimeout(() => setStep('result'), 1200)
  }

  if (step === 'bet') return (
    <div className="min-h-dvh flex flex-col px-6 pt-12" style={{background:'#1a0a00'}}>
      <button onClick={() => router.back()} className="text-[#F5E6D3]/40 text-sm mb-6">← Retour</button>
      <div className="text-4xl mb-3">🎵</div>
      <h1 className="text-[#F5E6D3] text-2xl font-black mb-1">Blind Test</h1>
      <p className="text-[#F5E6D3]/50 text-sm mb-2">MISE TON PARI AVANT D'ÉCOUTER</p>
      <div className="text-xs font-bold mb-8 px-3 py-1 rounded-full inline-block" style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B'}}>Catégorie : Hits toutes époques</div>
      <div className="bg-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button onClick={() => setBet(b => Math.max(50, b - 50))} className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" style={{background:'rgba(255,255,255,0.1)',color:'#fff'}}>-</button>
          <span className="text-4xl font-black" style={{color:'#F59E0B'}}>{bet}</span>
          <button onClick={() => setBet(b => Math.min(500, b + 50))} className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" style={{background:'rgba(255,255,255,0.1)',color:'#fff'}}>+</button>
        </div>
        <div className="text-center text-[#F5E6D3]/40 text-xs">Solde : {coins} coins · Mise max : 500</div>
      </div>
      <div className="flex gap-3 text-xs text-center mb-8">
        <div className="flex-1 rounded-xl p-3" style={{background:'rgba(34,197,94,0.1)',color:'#22c55e'}}>✅ Bonne réponse<br/><strong>mise × 3</strong></div>
        <div className="flex-1 rounded-xl p-3" style={{background:'rgba(239,68,68,0.1)',color:'#ef4444'}}>❌ Mauvaise<br/><strong>mise perdue</strong></div>
      </div>
      <button onClick={() => { setStep('listen'); setTimer(30); setSelected(null) }}
        className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95"
        style={{background:'#F59E0B',color:'#1a0a00'}}>
        Je suis prêt — Go ! 🎵
      </button>
    </div>
  )

  if (step === 'listen') return (
    <div className="min-h-dvh flex flex-col px-4 pt-10" style={{background:'#1a0a00'}}>
      <div className="flex justify-between items-center mb-6">
        <span className="text-[#F5E6D3]/50 text-sm">Manche {tIndex + 1} / {tracks.length}</span>
        <span className={`font-black text-lg ${timer <= 10 ? 'timer-urgent' : ''}`} style={{color: timer <= 10 ? '#ef4444' : '#F59E0B'}}>⏱ {timer}s</span>
      </div>
      <div className="w-full h-2 rounded-full mb-8" style={{background:'rgba(255,255,255,0.1)'}}>
        <div className="h-2 rounded-full transition-all" style={{width:`${(timer/30)*100}%`, background:'#F59E0B'}}></div>
      </div>

      {/* Visualisation audio */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 blindtest-circle" style={{background:'rgba(245,158,11,0.15)',border:'2px solid #F59E0B'}}>
          <div className="text-5xl">🎵</div>
        </div>
        <div className="flex items-end gap-1 mb-6 h-10">
          {Array.from({length:7}).map((_,i) => <div key={i} className="wave-bar"></div>)}
        </div>
        <p className="text-[#F5E6D3]/60 text-sm mb-2">Extrait en cours d'écoute...</p>
        {blocked && <p className="text-[#F5E6D3]/30 text-xs">Réponses disponibles dans {Math.max(0, 8 - (30 - timer))}s</p>}
      </div>

      <div className="mb-8">
        <p className="text-[#F5E6D3]/60 text-sm text-center mb-4">Qui chante cette chanson ?</p>
        <div className="grid grid-cols-2 gap-3">
          {track.answers.map((a, i) => {
            let bg = blocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'
            let color = blocked ? 'rgba(255,255,255,0.3)' : '#fff'
            if (selected !== null) {
              if (i === track.correct) { bg = '#22c55e'; color = '#fff' }
              else if (i === selected) { bg = '#ef4444'; color = '#fff' }
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={blocked}
                className="py-4 px-3 rounded-2xl font-medium text-sm transition-all active:scale-95"
                style={{background:bg, color, border:'1px solid rgba(255,255,255,0.1)'}}>
                {a}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{background:'#1a0a00'}}>
      <div className="text-6xl mb-4 slide-up">{won ? '🎉' : '😔'}</div>
      <h2 className="text-2xl font-black mb-2 slide-up" style={{color: won ? '#F59E0B' : '#ef4444', textShadow: won ? '0 0 20px rgba(245,158,11,0.6)' : '0 0 20px rgba(239,68,68,0.5)'}}>{won ? 'Bonne réponse !' : 'Raté...'}</h2>
      <p className="text-[#F5E6D3]/60 mb-1">C'était <strong className="text-[#F5E6D3]">{track.title}</strong></p>
      <p className="text-[#F5E6D3]/60 text-sm mb-6">{track.artist} — {track.year}</p>
      <div className={`text-5xl font-black mb-2 ${won ? 'score-win' : 'slide-up'}`} style={{color: won ? '#F59E0B' : '#ef4444', textShadow: won ? '0 0 24px rgba(245,158,11,0.7)' : '0 0 20px rgba(239,68,68,0.6)'}}>
        {won ? `+${bet * 3}` : `-${bet}`}
      </div>
      <p className="text-[#F5E6D3]/50 text-sm mb-1">coins {won ? 'gagnés' : 'perdus'}</p>
      <p className="text-[#F5E6D3]/40 text-xs mb-8">Nouveau solde : {coins} coins ⚡</p>
      {tIndex + 1 < tracks.length ? (
        <button onClick={() => { setTIndex(t => t + 1); setStep('bet'); setSelected(null) }}
          className="w-full py-4 rounded-2xl font-bold mb-3 transition-transform active:scale-95"
          style={{background:'#F59E0B',color:'#1a0a00'}}>Manche suivante →</button>
      ) : (
        <button onClick={() => { setTIndex(0); setStep('bet'); setSelected(null) }}
          className="w-full py-4 rounded-2xl font-bold mb-3 transition-transform active:scale-95"
          style={{background:'#F59E0B',color:'#1a0a00'}}>Rejouer ⚡</button>
      )}
      <button onClick={() => router.push('/games')} className="text-[#F5E6D3]/50 text-sm">← Retour aux jeux</button>
    </div>
  )
}
