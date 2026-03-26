'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const questions = [
  { q: 'Quel cocktail contient vodka, jus de citron et sirop de grenadine ?', answers: ['Cosmopolitan', 'Sex on the Beach', 'Tequila Sunrise', 'Margarita'], correct: 0 },
  { q: 'Dans quel pays a été inventée la bière Guinness ?', answers: ['Écosse', 'Angleterre', 'Irlande', 'Pays de Galles'], correct: 2 },
  { q: 'Combien de centilitres contient un "demi" de bière en France ?', answers: ['25 cl', '33 cl', '50 cl', '20 cl'], correct: 0 },
  { q: "Quel est l'ingrédient principal du Pastis ?", answers: ['Anis', 'Menthe', 'Citron', 'Gentiane'], correct: 0 },
  { q: 'Le Mojito est originaire de quel pays ?', answers: ['Mexique', 'Brésil', 'Cuba', 'Jamaïque'], correct: 2 },
]

export default function Quiz() {
  const router = useRouter()
  const [step, setStep] = useState<'bet'|'game'|'result'>('bet')
  const [bet, setBet] = useState(100)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(15)
  const [selected, setSelected] = useState<number|null>(null)
  const [coins, setCoins] = useState(1247)
  const [showConf, setShowConf] = useState(false)

  useEffect(() => {
    if (step !== 'game' || selected !== null) return
    if (timer === 0) { nextQ(false); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, step, selected])

  function startGame() { setStep('game'); setTimer(15) }
  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === questions[qIndex].correct) setScore(s => s + 1)
    setTimeout(() => nextQ(i === questions[qIndex].correct), 1200)
  }
  function nextQ(_correct: boolean) {
    if (qIndex + 1 >= questions.length) {
      const earned = score * 60 + (score === questions.length ? bet * 2 : Math.round(bet * score / questions.length))
      setCoins(c => c + earned)
      setShowConf(true)
      setStep('result')
    } else {
      setQIndex(q => q + 1); setSelected(null); setTimer(15)
    }
  }

  if (step === 'bet') return (
    <div className="min-h-dvh flex flex-col px-6 pt-12" style={{background:'#1a1a2e'}}>
      <button onClick={() => router.back()} className="text-white/40 text-sm mb-8">← Retour</button>
      <div className="text-4xl mb-4">❓</div>
      <h1 className="text-white text-2xl font-black mb-1">Quiz Culture Bar</h1>
      <p className="text-white/50 text-sm mb-8">Mise optionnelle avant de commencer</p>
      <div className="bg-white/10 rounded-2xl p-6 mb-6">
        <div className="text-white/60 text-sm mb-4 text-center">Ta mise</div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setBet(b => Math.max(0, b - 50))} className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" style={{background:'rgba(255,255,255,0.1)',color:'#fff'}}>-</button>
          <span className="text-4xl font-black" style={{color:'#F59E0B'}}>{bet}</span>
          <button onClick={() => setBet(b => Math.min(coins, b + 50))} className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" style={{background:'rgba(255,255,255,0.1)',color:'#fff'}}>+</button>
        </div>
        <div className="text-center text-white/40 text-xs mt-3">Solde : {coins} coins</div>
      </div>
      <button onClick={startGame} className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95" style={{background:'#F59E0B',color:'#1a1a2e'}}>
        Commencer le quiz ⚡
      </button>
    </div>
  )

  if (step === 'game') {
    const q = questions[qIndex]
    const pct = (timer / 15) * 100
    return (
      <div className="min-h-dvh flex flex-col px-4 pt-10" style={{background:'#1a1a2e'}}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/60 text-sm">Question {qIndex + 1} / {questions.length}</span>
          <span className="font-bold text-lg" style={{color: timer <= 5 ? '#ef4444' : '#F59E0B'}}>⏱ {timer}s</span>
        </div>
        <div className="w-full h-2 rounded-full mb-6" style={{background:'rgba(255,255,255,0.1)'}}>
          <div className="h-2 rounded-full transition-all" style={{width:`${pct}%`, background: timer <= 5 ? '#ef4444' : '#F59E0B'}}></div>
        </div>
        <div className="text-white text-xl font-bold mb-8 leading-snug">{q.q}</div>
        <div className="grid grid-cols-2 gap-3 flex-1">
          {q.answers.map((a, i) => {
            let bg = 'rgba(255,255,255,0.1)'
            let color = '#fff'
            if (selected !== null) {
              if (i === q.correct) { bg = '#22c55e'; color = '#fff' }
              else if (i === selected) { bg = '#ef4444'; color = '#fff' }
            }
            return (
              <button key={i} onClick={() => choose(i)}
                className="py-4 px-3 rounded-2xl font-medium text-sm transition-all active:scale-95 text-left"
                style={{background:bg, color, border: selected === null ? '1px solid rgba(255,255,255,0.1)' : 'none'}}>
                {a}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const earned = score * 60 + (score >= 4 ? bet * 2 : Math.round(bet * score / questions.length))
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{background:'#1a1a2e'}}>
      {showConf && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-20">
          {['#F59E0B','#22c55e','#ef4444','#FCD34D','#fff'].map((c,i) => (
            <div key={i} className="confetti-item" style={{background:c, left:`${15+i*15}%`, animationDelay:`${i*0.1}s`}}></div>
          ))}
        </div>
      )}
      <div className="text-6xl mb-6">{score >= 4 ? '🎉' : score >= 2 ? '👍' : '😅'}</div>
      <h2 className="text-white text-3xl font-black mb-2">{score >= 4 ? 'Bravo !' : 'Pas mal !'}</h2>
      <p className="text-white/60 mb-6">{score} / {questions.length} bonnes réponses</p>
      <div className="text-5xl font-black mb-2" style={{color:'#F59E0B'}}>+{earned}</div>
      <p className="text-white/50 text-sm mb-2">coins gagnés</p>
      <p className="text-white/40 text-xs mb-8">Nouveau solde : {coins} coins ⚡</p>
      <button onClick={() => { setStep('bet'); setQIndex(0); setScore(0); setSelected(null); setShowConf(false) }}
        className="w-full py-4 rounded-2xl font-bold mb-3 transition-transform active:scale-95"
        style={{background:'#F59E0B',color:'#1a1a2e'}}>Rejouer</button>
      <button onClick={() => router.push('/games')} className="text-white/50 text-sm">← Retour aux jeux</button>
    </div>
  )
}
