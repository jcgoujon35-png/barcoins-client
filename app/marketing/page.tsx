'use client'
import BarQuiz from '@/components/quiz/BarQuiz'

export default function MarketingPage() {
  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#E9C16B' }}>
            DÉMO INTERACTIVE
          </span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff',
            marginTop: 12, letterSpacing: '-0.03em' }}>
            Vivez l'expérience{' '}
            <span style={{ color: '#E9C16B', fontStyle: 'italic' }}>
              comme vos clients
            </span>
          </h2>
        </div>
        <BarQuiz />
      </section>
    </main>
  )
}
