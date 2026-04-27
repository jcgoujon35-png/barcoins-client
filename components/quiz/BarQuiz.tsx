'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY      = '#0D1B2E'
const CARD      = '#142745'
const GOLD      = '#C9902A'
const GOLD_L    = '#E9C16B'
const SUCCESS   = '#22C55E'
const ERROR     = '#ef4444'
const GOLD_GLOW = 'rgba(201,144,42,0.15)'

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    quote: '« Je vais lui faire une offre qu\'il ne pourra pas refuser. »',
    question: 'Dans quel film cette réplique culte est-elle prononcée ?',
    options: ['Scarface', 'Le Parrain', 'Les Affranchis', 'Casino'],
    correct: 1,
    explanation: 'Le Parrain (1972), Marlon Brando / Al Pacino.',
    funFact: 'C\'est aussi ce qu\'on dit aux gérants qui découvrent BarCoins.',
  },
  {
    quote: '« Houston, on a un problème. »',
    question: 'Cette réplique est tirée de quel film ?',
    options: ['Interstellar', 'Gravity', 'Apollo 13', 'Armageddon'],
    correct: 2,
    explanation: 'Apollo 13 (1995).',
    funFact: 'Nous aussi on avait un problème : les bars sans fidélisation. On a trouvé la solution.',
  },
  {
    quote: '« Hasta la vista, baby. »',
    question: 'Qui prononce cette réplique culte ?',
    options: ['John McClane', 'Le Terminator', 'Robocop', 'Judge Dredd'],
    correct: 1,
    explanation: 'Arnold Schwarzenegger dans Terminator 2 (1991).',
    funFact: 'Ce qu\'on dit aux soirées creuses quand BarCoins est installé.',
  },
  {
    quote: '« Je suis le roi du monde ! »',
    question: 'Dans quel film cette réplique est-elle criée ?',
    options: ['Titanic', 'Braveheart', 'Gladiator', 'The Wolf of Wall Street'],
    correct: 0,
    explanation: 'Titanic (1997), Leonardo DiCaprio.',
    funFact: 'Ce que ressent votre meilleur client quand il est N°1 du classement.',
  },
  {
    quote: '« Tu parles à moi ? »',
    question: 'Cette réplique culte est tirée de quel film ?',
    options: ['Serpico', 'Taxi Driver', 'Mean Streets', 'Raging Bull'],
    correct: 1,
    explanation: 'Taxi Driver (1976), Robert De Niro.',
    funFact: 'Ce que dit votre client quand il reçoit une notification BarCoins un lundi soir.',
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────
const TIMER_MAX  = 15
const TIMER_R    = 22
const TIMER_CIRC = 2 * Math.PI * TIMER_R
const RING_R     = 54
const RING_CIRC  = 2 * Math.PI * RING_R

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'intro' | 'playing' | 'feedback' | 'score'
interface Answer { correct: boolean; coins: number }
interface Player { id: string; name: string; initials: string; coins: number; color: string; isYou?: boolean }
interface Toast  { id: number; msg: string; dying?: boolean }

// ─── Leaderboard initial data ─────────────────────────────────────────────────
const INIT_PLAYERS: Player[] = [
  { id: 'sophie', name: 'Sophie L.',  initials: 'SL', coins: 340, color: '#7c3aed' },
  { id: 'marc',   name: 'Marc A.',    initials: 'MA', coins: 290, color: '#2563eb' },
  { id: 'thomas', name: 'Thomas R.',  initials: 'TR', coins: 245, color: '#059669' },
  { id: 'claire', name: 'Claire M.',  initials: 'CM', coins: 180, color: '#ea580c' },
  { id: 'you',    name: 'VOUS',       initials: '⚡', coins: 0,   color: GOLD, isYou: true },
]

// ─── CSS animations ───────────────────────────────────────────────────────────
const STYLES = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes pulseGreen {
    0%,100% { box-shadow: 0 0 0 0    rgba(34,197,94,0.5); }
    50%     { box-shadow: 0 0 0 14px rgba(34,197,94,0);   }
  }
  @keyframes pulseRed {
    0%,100% { box-shadow: 0 0 0 0    rgba(239,68,68,0.5); }
    50%     { box-shadow: 0 0 0 14px rgba(239,68,68,0);   }
  }
  @keyframes ringIn {
    from { stroke-dashoffset: var(--ring-from); }
    to   { stroke-dashoffset: var(--ring-to);   }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-16px) scale(.96); }
    to   { opacity: 1; transform: translateY(0)     scale(1);   }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateY(0)     scale(1);  }
    to   { opacity: 0; transform: translateY(-8px)  scale(.95); }
  }
  @keyframes urgentBlink {
    0%,100% { border-color: rgba(239,68,68,0.3); box-shadow: none; }
    50%     { border-color: rgba(239,68,68,0.9); box-shadow: 0 0 18px rgba(239,68,68,0.25); }
  }
  @keyframes timerPulse {
    0%,100% { transform: scale(1);    }
    50%     { transform: scale(1.18); }
  }
  @keyframes slidePos {
    from { opacity: 0.4; transform: translateY(-6px); }
    to   { opacity: 1;   transform: translateY(0);    }
  }
  @keyframes podiumRise {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes liveBlip {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.3; }
  }
  @keyframes coinFly {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-170px) scale(0.4); }
  }
  @keyframes counterPulse {
    0%,100% { color: #E9C16B; transform: scale(1); }
    40%     { color: #fff;    transform: scale(1.3); }
  }
  .bq-enter       { animation: fadeSlideUp 0.4s ease forwards; }
  .bq-counter-pulse { animation: counterPulse 0.6s ease forwards; }
  .bq-pulse-g     { animation: pulseGreen  0.6s ease; }
  .bq-pulse-r     { animation: pulseRed    0.6s ease; }
  .bq-ring        { animation: ringIn 1.2s cubic-bezier(.4,0,.2,1) forwards; }
  .bq-btn         { transition: opacity .15s, transform .1s; }
  .bq-btn:hover   { opacity: .88; transform: scale(1.02); }
  .bq-btn:active  { transform: scale(.97); }
  .bq-toast       { animation: toastIn  0.3s ease forwards; }
  .bq-toast-out   { animation: toastOut 0.3s ease forwards; }
  .bq-urgent      { animation: urgentBlink 0.5s ease infinite; }
  .bq-timer-pulse { animation: timerPulse  0.5s ease infinite; }
  .bq-slide-pos   { animation: slidePos    0.35s ease forwards; }
  .bq-live-blip   { animation: liveBlip    1.2s ease infinite; }
`

let toastId = 0

// ─── Main component ───────────────────────────────────────────────────────────
export default function BarQuiz() {
  const [phase,     setPhase]    = useState<Phase>('intro')
  const [qIndex,    setQIndex]   = useState(0)
  const [timeLeft,  setTimeLeft] = useState(TIMER_MAX)
  const [selected,  setSelected] = useState<number | null>(null)
  const [answers,   setAnswers]  = useState<Answer[]>([])
  const [animKey,   setAnimKey]  = useState(0)
  const [players,   setPlayers]  = useState<Player[]>(INIT_PLAYERS.map(p => ({ ...p })))
  const [toasts,    setToasts]   = useState<Toast[]>([])
  const [liveCount, setLiveCount] = useState(47)
  const [autoNext,     setAutoNext]     = useState<number | null>(null)
  const [streak,       setStreak]       = useState(0)
  const [coinBurst,    setCoinBurst]    = useState(false)
  const [prevPositions, setPrevPositions] = useState<Record<string, number>>({})

  const qIndexRef = useRef(qIndex)
  qIndexRef.current = qIndex

  const sortedPlayers = [...players].sort((a, b) => b.coins - a.coins)
  const yourPosition  = sortedPlayers.findIndex(p => p.isYou) + 1
  const totalCoins    = answers.reduce((s, a) => s + a.coins, 0)
  const correctCount  = answers.filter(a => a.correct).length
  const lastCoins     = answers[answers.length - 1]?.coins ?? 0
  const q             = QUESTIONS[qIndex]

  // ─── Toast helper ──────────────────────────────────────────────
  const addToast = useCallback((msg: string) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, dying: true } : t))
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 320)
    }, 2700)
  }, [])

  // ─── Live count fluctuation ─────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setLiveCount(n => Math.max(42, Math.min(54, n + (Math.random() > 0.5 ? 2 : -2))))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  // ─── Leaderboard random simulation ─────────────────────────────
  useEffect(() => {
    if (phase === 'intro' || phase === 'score') return
    const delay = 4000 + Math.random() * 2000
    const t = setTimeout(() => {
      setPlayers(prev => prev.map(p => {
        if (p.isYou) return p
        const delta = Math.floor(Math.random() * 40) + 10
        return { ...p, coins: p.coins + delta }
      }))
    }, delay)
    return () => clearTimeout(t)
  }, [phase, players])

  // ─── Track position changes, toast on VOUS montée ───────────────
  useEffect(() => {
    const newPos: Record<string, number> = {}
    sortedPlayers.forEach((p, i) => { newPos[p.id] = i + 1 })
    if (prevPositions['you'] && newPos['you'] < prevPositions['you']) {
      addToast(`🏆 VOUS passez N°${newPos['you']} !`)
    }
    setPrevPositions(newPos)
  }, [players]) // eslint-disable-line

  // ─── Timer tick ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) { submitAnswer(-1); return }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft]) // eslint-disable-line

  // ─── Auto-next: start countdown on feedback ────────────────────
  useEffect(() => {
    if (phase === 'feedback') setAutoNext(3)
  }, [phase])

  useEffect(() => {
    if (autoNext === null) return
    if (autoNext <= 0) {
      doNext()
      return
    }
    const t = setTimeout(() => setAutoNext(v => v !== null ? v - 1 : null), 1000)
    return () => clearTimeout(t)
  }, [autoNext]) // eslint-disable-line

  // ─── Intro toast ────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'playing' && qIndexRef.current === 0) {
      setTimeout(() => addToast(`🎮 La soirée commence — ${liveCount} joueurs connectés`), 600)
    }
  }, [phase]) // eslint-disable-line

  // ─── Submit answer ──────────────────────────────────────────────
  const submitAnswer = useCallback((idx: number) => {
    if (phase !== 'playing') return
    const correct   = idx === q.correct
    const coins     = correct ? Math.round(50 * timeLeft / TIMER_MAX) : 0
    const newStreak = correct ? streak + 1 : 0

    setSelected(idx)
    setAnswers(prev => [...prev, { correct, coins }])
    setStreak(newStreak)
    setPhase('feedback')

    if (correct) {
      setPlayers(prev => prev.map(p => p.isYou ? { ...p, coins: p.coins + coins } : p))
      setCoinBurst(true)
      setTimeout(() => setCoinBurst(false), 950)
    }

    // Toasts contextuels
    if (idx === -1) {
      const rivals = ['Marc A.', 'Sophie L.', 'Thomas R.']
      addToast(`⏱ Trop lent ! ${rivals[Math.floor(Math.random() * rivals.length)]} vient de passer devant vous`)
    } else if (!correct) {
      addToast(`💀 Raté ! Sophie L. prend de l'avance...`)
    } else if (timeLeft >= 11) {
      addToast(`⚡ Réponse éclair ! +${coins} BarCoins`)
    } else if (newStreak >= 4) {
      addToast(`🔥 ${newStreak} à la suite ! Vous êtes en feu ce soir`)
    } else {
      addToast(`✓ Bonne réponse ! +${coins} BarCoins`)
    }
  }, [phase, q, timeLeft, streak, addToast]) // eslint-disable-line

  // ─── Next question ──────────────────────────────────────────────
  const doNext = useCallback(() => {
    setAutoNext(null)
    const ni = qIndexRef.current + 1
    if (ni >= QUESTIONS.length) { setPhase('score'); return }
    setQIndex(ni)
    setTimeLeft(TIMER_MAX)
    setSelected(null)
    setAnimKey(k => k + 1)
    setPhase('playing')
  }, [])

  const handleNextClick = () => { setAutoNext(null); doNext() }

  // ─── Restart ────────────────────────────────────────────────────
  const restart = () => {
    setPhase('intro'); setQIndex(0); setTimeLeft(TIMER_MAX)
    setSelected(null); setAnswers([]); setAnimKey(k => k + 1)
    setPlayers(INIT_PLAYERS.map(p => ({ ...p }))); setStreak(0); setAutoNext(null)
  }

  const timerColor = timeLeft > 5 ? GOLD : timeLeft > 3 ? '#f59e0b' : ERROR
  const timerDash  = TIMER_CIRC * (timeLeft / TIMER_MAX)
  const isUrgent   = timeLeft <= 3
  const isWarning  = timeLeft <= 5

  return (
    <div style={{ background: NAVY, fontFamily: "'Outfit', sans-serif", width: '100%', position: 'relative' }}>
      <style>{STYLES}</style>

      {/* Toast layer */}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none', width: 'min(96vw, 420px)' }}>
        {toasts.map(t => (
          <div key={t.id} className={t.dying ? 'bq-toast-out' : 'bq-toast'}
            style={{ background: CARD, border: `1px solid rgba(233,193,107,0.4)`, borderRadius: 12, padding: '0.6rem 1.1rem', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#fff', whiteSpace: 'nowrap', boxShadow: `0 4px 20px ${GOLD_GLOW}` }}>
            {t.msg}
          </div>
        ))}
      </div>

      {phase === 'intro' && (
        <IntroScreen onStart={() => { setAnimKey(k => k + 1); setPhase('playing') }} />
      )}

      {(phase === 'playing' || phase === 'feedback') && (
        <div style={{ padding: '12px 16px 32px' }}>
          {/* Live bar */}
          <LiveBar count={liveCount} />

          {/* Leaderboard compact — toujours visible sur mobile */}
          <div style={{ display: 'block', marginBottom: 12 }}>
            <LeaderboardCompact players={sortedPlayers} yourPosition={yourPosition} />
          </div>

          {/* Desktop : quiz + leaderboard complet côte à côte */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <QuizScreen
                key={animKey}
                q={q}
                qIndex={qIndex}
                total={QUESTIONS.length}
                timeLeft={timeLeft}
                timerDash={timerDash}
                timerColor={timerColor}
                isUrgent={isUrgent}
                isWarning={isWarning}
                selected={selected}
                phase={phase}
                onAnswer={submitAnswer}
                onNext={handleNextClick}
                lastCoins={lastCoins}
                autoNext={autoNext}
                coinBurst={coinBurst}
                totalCoins={totalCoins}
              />
            </div>
            {/* Leaderboard complet — masqué sur mobile via min-width */}
            <div style={{ width: 220, flexShrink: 0, display: 'var(--lb-display, none)' }}>
              <LeaderboardPanel players={sortedPlayers} yourPosition={yourPosition} />
            </div>
          </div>
          <style>{`@media(min-width:700px){[style*="--lb-display"]{--lb-display:block}}`}</style>
        </div>
      )}

      {phase === 'score' && (
        <ScoreScreen
          correctCount={correctCount}
          totalCoins={totalCoins}
          total={QUESTIONS.length}
          yourPosition={yourPosition}
          players={sortedPlayers}
          onRestart={restart}
        />
      )}
    </div>
  )
}

// ─── Live bar ─────────────────────────────────────────────────────────────────
function LiveBar({ count }: { count: number }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.5rem 1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="bq-live-blip" style={{ width: 8, height: 8, borderRadius: '50%', background: ERROR, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
        EN DIRECT
      </span>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>·</span>
      <span style={{ color: GOLD_L, fontSize: '0.8rem' }}>{count} joueurs</span>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>·</span>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>Le Comptoir, Perpignan</span>
    </div>
  )
}

// ─── Leaderboard compact (mobile strip) ──────────────────────────────────────
function LeaderboardCompact({ players, yourPosition }: { players: Player[]; yourPosition: number }) {
  const prevOrder = useRef<string[]>([])
  const currentOrder = players.map(p => p.id)

  const getArrow = (id: string) => {
    const prev = prevOrder.current.indexOf(id)
    const curr = currentOrder.indexOf(id)
    if (prev === -1 || prev === curr) return null
    return curr < prev
      ? <span style={{ color: SUCCESS, fontSize: 9, lineHeight: 1 }}>▲</span>
      : <span style={{ color: ERROR,   fontSize: 9, lineHeight: 1 }}>▼</span>
  }

  useEffect(() => { prevOrder.current = currentOrder }, [players]) // eslint-disable-line

  return (
    <div style={{ background: CARD, border: `1px solid rgba(233,193,107,0.2)`, borderRadius: 12, padding: '0.6rem 0.75rem', boxShadow: `0 4px 20px ${GOLD_GLOW}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem' }}>
        <span className="bq-live-blip" style={{ width: 7, height: 7, borderRadius: '50%', background: ERROR, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.68rem', letterSpacing: 2, textTransform: 'uppercase', flex: 1 }}>Classement en direct</span>
        {yourPosition <= 3 && (
          <span style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontSize: '0.68rem', fontWeight: 700 }}>🔥 N°{yourPosition}</span>
        )}
      </div>
      {/* Players row */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
        {players.map((p, i) => (
          <div key={p.id} className="bq-slide-pos"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: '1 0 0', minWidth: 48, padding: '0.3rem 0.2rem', borderRadius: 9,
              background: p.isYou ? 'rgba(201,144,42,0.15)' : 'rgba(255,255,255,0.03)',
              border: p.isYou ? `1px solid rgba(201,144,42,0.35)` : '1px solid transparent' }}>
            {/* Position + arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>{i + 1}</span>
              {getArrow(p.id)}
            </div>
            {/* Avatar */}
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: p.isYou ? 14 : 10, fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: p.isYou ? `0 0 0 2px ${GOLD}` : 'none' }}>
              {p.isYou ? '⚡' : p.initials}
            </div>
            {/* Name */}
            <span style={{ color: p.isYou ? GOLD_L : 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: p.isYou ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 48 }}>
              {p.isYou ? 'VOUS' : p.name.split(' ')[0]}
            </span>
            {/* Coins */}
            <span style={{ color: p.isYou ? GOLD_L : 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
              {p.coins}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Leaderboard panel ────────────────────────────────────────────────────────
function LeaderboardPanel({ players, yourPosition }: { players: Player[]; yourPosition: number }) {
  const prevOrder = useRef<string[]>([])
  const currentOrder = players.map(p => p.id)

  const getArrow = (id: string) => {
    const prev = prevOrder.current.indexOf(id)
    const curr = currentOrder.indexOf(id)
    if (prev === -1) return null
    if (curr < prev) return <span style={{ color: SUCCESS, fontSize: 10 }}>▲</span>
    if (curr > prev) return <span style={{ color: ERROR,   fontSize: 10 }}>▼</span>
    return null
  }

  useEffect(() => { prevOrder.current = currentOrder }, [players]) // eslint-disable-line

  return (
    <div style={{ background: CARD, border: `1px solid rgba(233,193,107,0.15)`, borderRadius: 14, padding: '1rem', boxShadow: `0 4px 24px ${GOLD_GLOW}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.85rem' }}>
        <span className="bq-live-blip" style={{ width: 7, height: 7, borderRadius: '50%', background: ERROR, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase', flex: 1 }}>Classement en direct</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {players.map((p, i) => (
          <div key={p.id} className="bq-slide-pos"
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0.4rem 0.55rem', borderRadius: 10,
              background: p.isYou ? 'rgba(201,144,42,0.12)' : 'rgba(255,255,255,0.03)',
              border: p.isYou ? `1px solid rgba(201,144,42,0.3)` : '1px solid transparent' }}>
            {/* Rang */}
            <span style={{ width: 16, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0, fontWeight: 700 }}>{i + 1}</span>
            {/* Avatar coloré */}
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, opacity: p.isYou ? 1 : 0.9 }}>
              {p.isYou ? '⚡' : p.initials}
            </div>
            {/* Nom */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: p.isYou ? GOLD_L : '#fff', fontSize: '0.77rem', fontWeight: p.isYou ? 700 : 400, fontFamily: p.isYou ? "'Syne', sans-serif" : undefined }}>
              {p.name}
            </div>
            {/* Flèche évolution */}
            <span style={{ flexShrink: 0, width: 12 }}>{getArrow(p.id)}</span>
            {/* Coins */}
            <span style={{ color: p.isYou ? GOLD_L : 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{p.coins}</span>
          </div>
        ))}
      </div>
      {yourPosition <= 3 && (
        <div style={{ marginTop: '0.7rem', textAlign: 'center', color: GOLD_L, fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', fontWeight: 700 }}>
          🔥 Vous êtes N°{yourPosition} !
        </div>
      )}
    </div>
  )
}

// ─── Intro screen ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="bq-enter flex flex-col items-center justify-center px-4 py-16 text-center">
      <span style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontSize: 12, letterSpacing: 3 }} className="uppercase mb-4">
        Quiz Culture Bar
      </span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15 }} className="mb-4 max-w-xl">
        Testez votre culture ciné&nbsp;🎬
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440 }} className="mb-8 text-base leading-relaxed">
        5 questions · 15 secondes chacune · Plus vous répondez vite, plus vous gagnez de BarCoins.
      </p>
      <div style={{ background: CARD, border: `1px solid rgba(233,193,107,0.2)`, borderRadius: 16, padding: '1.25rem 2rem', marginBottom: '2rem', boxShadow: `0 8px 32px ${GOLD_GLOW}` }}>
        <div className="flex gap-8 text-center">
          {[['5', 'questions'], ['15s', 'par question'], ['50', 'BarCoins max']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="bq-btn" onClick={onStart}
        style={{ background: GOLD, color: NAVY, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', padding: '0.85rem 2.5rem', borderRadius: 999, border: 'none', cursor: 'pointer', letterSpacing: 0.5 }}>
        Jouer maintenant →
      </button>
    </div>
  )
}

// ─── Quiz screen ──────────────────────────────────────────────────────────────
const COIN_X = [-70, -45, -20, 0, 20, 45, 70, 85]

interface QuizScreenProps {
  q: typeof QUESTIONS[0]
  qIndex: number; total: number
  timeLeft: number; timerDash: number; timerColor: string
  isUrgent: boolean; isWarning: boolean
  selected: number | null; phase: Phase
  onAnswer: (i: number) => void; onNext: () => void
  lastCoins: number; autoNext: number | null
  coinBurst: boolean; totalCoins: number
}

function QuizScreen({ q, qIndex, total, timeLeft, timerDash, timerColor, isUrgent, isWarning, selected, phase, onAnswer, onNext, lastCoins, autoNext, coinBurst, totalCoins }: QuizScreenProps) {
  const isCorrect  = selected !== null && selected !== -1 && selected === q.correct
  const isTimeout  = phase === 'feedback' && selected === -1
  const isFeedback = phase === 'feedback'
  const showBad    = isFeedback && !isCorrect

  return (
    <div className="bq-enter flex flex-col" style={{ position: 'relative' }}>
      {/* Progress + compteur BarCoins */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Question {qIndex + 1} / {total}</span>
          <span className={coinBurst ? 'bq-counter-pulse' : ''} style={{ color: GOLD_L, fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            ⚡ {totalCoins} BarCoins
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <span style={{ color: GOLD_L, fontSize: 11 }}>{Array.from({ length: total }).map((_, i) => i < qIndex ? '●' : i === qIndex ? '◉' : '○').join(' ')}</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 4 }}>
          <div style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, width: `${((qIndex + 1) / total) * 100}%`, height: '100%', borderRadius: 99, transition: 'width .4s ease' }} />
        </div>
      </div>

      {/* Pièces animées — bonne réponse */}
      {coinBurst && COIN_X.map((x, i) => (
        <div key={i} style={{
          position: 'absolute', top: '55%', left: '50%',
          marginLeft: x, width: 14, height: 14, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${GOLD_L}, ${GOLD})`,
          boxShadow: `0 0 6px ${GOLD}`,
          animation: `coinFly 0.85s ease-out ${i * 55}ms forwards`,
          pointerEvents: 'none', zIndex: 20,
        }} />
      ))}

      {/* Card */}
      <div className={isUrgent ? 'bq-urgent' : ''}
        style={{ background: CARD, borderRadius: 16, border: `1px solid rgba(233,193,107,0.15)`, boxShadow: `0 8px 40px ${GOLD_GLOW}`, padding: 'clamp(1.1rem, 3vw, 1.75rem)' }}>

        {/* Timer + quote */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
          <div className={isWarning ? 'bq-timer-pulse' : ''} style={{ flexShrink: 0, position: 'relative', width: 52, height: 52 }}>
            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r={TIMER_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle cx="26" cy="26" r={TIMER_R} fill="none" stroke={timerColor}
                strokeWidth="3" strokeLinecap="round"
                strokeDasharray={TIMER_CIRC}
                strokeDashoffset={TIMER_CIRC - timerDash}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s' }}
              />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: timerColor, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.85rem' }}>
              {isFeedback ? '✓' : timeLeft}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)', lineHeight: 1.3, marginBottom: 5 }}>{q.quote}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>{q.question}</p>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i
            const isRight    = i === q.correct
            let bg     = 'rgba(255,255,255,0.05)'
            let border = 'rgba(255,255,255,0.1)'
            let pulse  = ''

            if (isFeedback) {
              if (isRight)               { bg = 'rgba(34,197,94,0.15)';  border = SUCCESS; pulse = 'bq-pulse-g' }
              else if (isSelected)       { bg = 'rgba(239,68,68,0.15)';  border = ERROR;   pulse = 'bq-pulse-r' }
            }

            return (
              <button key={i} className={`bq-btn ${pulse}`}
                disabled={isFeedback}
                onClick={() => onAnswer(i)}
                style={{ background: bg, border: `1px solid ${border}`, borderRadius: 11, padding: '0.7rem 0.85rem', cursor: isFeedback ? 'default' : 'pointer', textAlign: 'left', color: '#fff', fontSize: '0.87rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: GOLD_L, flexShrink: 0, fontWeight: 700 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
                {isFeedback && isRight    && <span style={{ color: SUCCESS, fontSize: 15, flexShrink: 0 }}>✓</span>}
                {isFeedback && isSelected && !isRight && <span style={{ color: ERROR, fontSize: 15, flexShrink: 0 }}>✗</span>}
              </button>
            )
          })}
        </div>

        {/* Feedback panel */}
        {isFeedback && (
          <div className="bq-enter" style={{ background: showBad ? 'rgba(239,68,68,0.07)' : 'rgba(34,197,94,0.07)', borderRadius: 12, border: `1px solid ${showBad ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, padding: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: '0.65rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: showBad ? ERROR : SUCCESS, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.83rem', marginBottom: 3 }}>
                  {isTimeout ? '⏱ Temps écoulé !' : isCorrect ? `✓ Bonne réponse ! +${lastCoins} BarCoins` : '✗ Mauvaise réponse'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginBottom: 3 }}>{q.explanation}</p>
                <p style={{ color: GOLD_L, fontSize: '0.78rem', fontStyle: 'italic' }}>💡 {q.funFact}</p>
              </div>
              {isCorrect && lastCoins > 0 && (
                <div style={{ flexShrink: 0, textAlign: 'center', background: 'rgba(201,144,42,0.15)', borderRadius: 9, padding: '0.4rem 0.65rem' }}>
                  <div style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>+{lastCoins}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9 }}>BarCoins</div>
                </div>
              )}
            </div>
            {/* Auto-next row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              {autoNext !== null && autoNext > 0 && (
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                  Question suivante dans {autoNext}…
                </span>
              )}
              <button className="bq-btn" onClick={onNext}
                style={{ marginLeft: 'auto', background: GOLD, color: NAVY, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', padding: '0.5rem 1rem', borderRadius: 9, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {qIndex + 1 < 5 ? 'Suivante →' : 'Mon score →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Score screen ─────────────────────────────────────────────────────────────
function ScoreScreen({ correctCount, totalCoins, total, yourPosition, players, onRestart }:
  { correctCount: number; totalCoins: number; total: number; yourPosition: number; players: Player[]; onRestart: () => void }) {

  const pct    = correctCount / total
  const ringTo = RING_CIRC * (1 - pct)

  const scoreLabel =
    yourPosition === 1 ? '👑 Vous êtes le maître de la soirée !' :
    yourPosition <= 3  ? '🥈 Podium ! Revenez demain pour la N°1' :
                         '💪 Pas mal — mais Sophie L. vous attend'

  const podiumOrder = [players[1], players[0], players[2]].filter(Boolean)
  const podiumHeights = [70, 100, 55]
  const podiumLabels  = ['🥈', '🥇', '🥉']

  return (
    <div className="bq-enter flex flex-col items-center px-4 py-10 text-center">
      {/* Score ring */}
      <div style={{ position: 'relative', width: 130, height: 130, marginBottom: '1rem' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={RING_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
          <circle cx="65" cy="65" r={RING_R} fill="none" stroke="url(#rg)" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={RING_CIRC} className="bq-ring"
            style={{ '--ring-from': RING_CIRC, '--ring-to': ringTo } as React.CSSProperties} />
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GOLD} /><stop offset="100%" stopColor={GOLD_L} />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.7rem', lineHeight: 1 }}>{correctCount}/{total}</span>
          <span style={{ color: GOLD_L, fontSize: 10 }}>bonnes rép.</span>
        </div>
      </div>

      <p style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{scoreLabel}</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
        {correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} · {totalCoins} BarCoins · Vous êtes N°{yourPosition}
      </p>

      {/* Podium */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: '1.5rem', height: 130 }}>
        {podiumOrder.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11 }}>{podiumLabels[i]}</span>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: p.isYou ? GOLD : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: p.isYou ? NAVY : 'rgba(255,255,255,0.7)' }}>{p.initials}</div>
            <div className="bq-podium" style={{ width: 64, background: i === 1 ? `linear-gradient(180deg, ${GOLD}, ${GOLD_L})` : 'rgba(255,255,255,0.08)', borderRadius: '6px 6px 0 0', height: podiumHeights[i], transformOrigin: 'bottom', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 6 }}>
              <span style={{ color: i === 1 ? NAVY : 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }}>{p.coins}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA card */}
      <div style={{ background: CARD, border: `1px solid rgba(233,193,107,0.2)`, borderRadius: 16, boxShadow: `0 12px 48px ${GOLD_GLOW}`, padding: 'clamp(1.25rem,4vw,2rem)', maxWidth: 480, width: '100%', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", color: '#fff', fontSize: 'clamp(1.2rem, 3vw, 1.7rem)', fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>
          Vos clients adorent jouer.
        </h2>
        <p style={{ color: GOLD_L, fontSize: '0.9rem', marginBottom: '1rem' }}>Donnez-leur une raison de jouer chez vous.</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 11, padding: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>Votre score</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.85rem' }}>{correctCount}/{total}</span>
              <span style={{ background: 'rgba(201,144,42,0.2)', color: GOLD_L, fontSize: 10, padding: '2px 7px', borderRadius: 99 }}>+{totalCoins} BarCoins</span>
              <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', fontSize: 10, padding: '2px 7px', borderRadius: 99 }}>N°{yourPosition}</span>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6 }}>
            Ce quiz, vos clients y jouent chaque soir dans votre bar.{' '}
            <span style={{ color: '#fff' }}>Classement en temps réel. BarCoins misables.</span>{' '}
            Ils reviennent pour défendre leur rang.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="#beta" className="bq-btn" style={{ display: 'block', background: GOLD, color: NAVY, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.92rem', padding: '0.8rem', borderRadius: 999, textDecoration: 'none', textAlign: 'center' }}>
            Rejoindre la beta →
          </a>
          <a href="#demo" className="bq-btn" style={{ display: 'block', border: `1px solid rgba(233,193,107,0.4)`, color: GOLD_L, fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.87rem', padding: '0.7rem', borderRadius: 999, textDecoration: 'none', textAlign: 'center', background: 'transparent' }}>
            Voir la démo →
          </a>
        </div>
      </div>

      <div style={{ border: `1px solid rgba(233,193,107,0.2)`, borderRadius: 999, padding: '0.3rem 0.9rem', marginBottom: '1.25rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 1.5 }}>// 2 PLACES RESTANTES · PERPIGNAN · JUILLET 2026</span>
      </div>

      <button onClick={onRestart} className="bq-btn" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}>
        Rejouer
      </button>
    </div>
  )
}
