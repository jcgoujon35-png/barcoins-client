'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

type Step = 'phone' | 'otp' | 'loading';
type Mode = 'player' | 'staff';

// Composant interne isolé — useSearchParams() doit être dans Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [mode, setMode] = useState<Mode>('player');

  // Player OTP state
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);

  // Staff state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);

  const [error, setError] = useState('');

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSending(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+33${phone.replace(/^0/, '')}`;

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'envoi du SMS");
        return;
      }

      // Dev mode : OTP retourné dans la réponse si Twilio non configuré
      if (data.devCode) {
        setError(`[DEV] Code : ${data.devCode}`);
      }

      setPhone(formattedPhone);
      setStep('otp');
    } catch {
      setError('Impossible de contacter le serveur');
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStep('loading');

    const result = await signIn('player-otp', {
      phone,
      code: otp,
      redirect: false,
    });

    if (result?.error) {
      setError('Code incorrect ou expiré. Réessaie.');
      setStep('otp');
      return;
    }

    router.push(callbackUrl);
  }

  async function handleStaffLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStaffLoading(true);

    const result = await signIn('staff-credentials', {
      email,
      password,
      redirect: false,
    });

    setStaffLoading(false);

    if (result?.error) {
      setError('Email ou mot de passe incorrect.');
      return;
    }

    router.push('/gerant');
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold" style={{ color: '#C9922A' }}>
          Bar<span style={{ color: '#F2C96B' }}>⚡</span>Coins
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(245,240,232,0.6)' }}>
          {mode === 'player' ? 'Entre ton numéro pour jouer' : 'Accès gérant / staff'}
        </p>
      </div>

      {/* Toggle player / staff */}
      <div className="flex rounded-xl overflow-hidden mb-6 w-full max-w-sm"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,146,42,0.2)' }}>
        <button
          onClick={() => { setMode('player'); setError(''); }}
          className="flex-1 py-2.5 text-sm font-bold transition-all"
          style={{
            background: mode === 'player' ? 'linear-gradient(135deg, #C9922A, #E8860A)' : 'transparent',
            color: mode === 'player' ? '#0D1B2E' : 'rgba(245,240,232,0.5)',
          }}>
          Joueur
        </button>
        <button
          onClick={() => { setMode('staff'); setError(''); }}
          className="flex-1 py-2.5 text-sm font-bold transition-all"
          style={{
            background: mode === 'staff' ? 'linear-gradient(135deg, #C9922A, #E8860A)' : 'transparent',
            color: mode === 'staff' ? '#0D1B2E' : 'rgba(245,240,232,0.5)',
          }}>
          Gérant / Staff
        </button>
      </div>

      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#1A2942', border: '1px solid rgba(201,146,42,0.3)' }}
      >

        {/* ── MODE JOUEUR ── */}
        {mode === 'player' && (
          <>
            {step === 'loading' && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 animate-pulse">⚡</div>
                <p style={{ color: 'rgba(245,240,232,0.8)' }}>Connexion en cours…</p>
              </div>
            )}

            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className="block text-sm font-medium" style={{ color: 'rgba(245,240,232,0.7)' }}>
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  required
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-lg outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,146,42,0.3)',
                    color: '#F5F0E8',
                  }}
                />
                {error && <p className="text-sm" style={{ color: error.startsWith('[DEV]') ? '#22C55E' : '#EF4444' }}>{error}</p>}
                <button
                  type="submit"
                  disabled={sending || phone.length < 10}
                  className="w-full rounded-xl py-3 font-bold text-base transition-opacity disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #C9922A 0%, #E8860A 50%, #F2C96B 100%)',
                    boxShadow: '0 4px 20px rgba(232,134,10,0.4)',
                    color: '#0D1B2E',
                  }}
                >
                  {sending ? 'Envoi…' : 'Recevoir le code →'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-sm" style={{ color: 'rgba(245,240,232,0.7)' }}>
                  Code envoyé au <span style={{ color: '#F2C96B' }}>{phone}</span>
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="_ _ _ _ _ _"
                  required
                  maxLength={6}
                  autoFocus
                  className="w-full rounded-xl px-4 py-4 text-3xl text-center tracking-widest font-bold outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,146,42,0.3)',
                    color: '#F2C96B',
                  }}
                />
                {error && <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>}
                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full rounded-xl py-3 font-bold text-base transition-opacity disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #C9922A 0%, #E8860A 50%, #F2C96B 100%)',
                    boxShadow: '0 4px 20px rgba(232,134,10,0.4)',
                    color: '#0D1B2E',
                  }}
                >
                  Valider →
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setError(''); }}
                  className="w-full text-sm py-2"
                  style={{ color: 'rgba(245,240,232,0.5)' }}
                >
                  Changer de numéro
                </button>
              </form>
            )}
          </>
        )}

        {/* ── MODE STAFF ── */}
        {mode === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(245,240,232,0.7)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@monbar.fr"
                required
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-base outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,146,42,0.3)',
                  color: '#F5F0E8',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(245,240,232,0.7)' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl px-4 py-3 text-base outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,146,42,0.3)',
                  color: '#F5F0E8',
                }}
              />
            </div>
            {error && <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>}
            <button
              type="submit"
              disabled={staffLoading || !email || !password}
              className="w-full rounded-xl py-3 font-bold text-base transition-opacity disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #C9922A 0%, #E8860A 50%, #F2C96B 100%)',
                boxShadow: '0 4px 20px rgba(232,134,10,0.4)',
                color: '#0D1B2E',
              }}
            >
              {staffLoading ? 'Connexion…' : 'Se connecter →'}
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-xs text-center" style={{ color: 'rgba(245,240,232,0.3)' }}>
        En continuant, tu acceptes nos{' '}
        <span style={{ color: 'rgba(201,146,42,0.7)' }}>conditions d&apos;utilisation</span>
      </p>
    </div>
  );
}

// Page wrapper avec Suspense obligatoire (Next.js 15 + useSearchParams)
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1B2E' }}>
        <div className="text-4xl animate-pulse">⚡</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
