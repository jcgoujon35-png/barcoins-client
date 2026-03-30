// ============================================================
// BARCOINS — OTP SMS via Twilio + Redis
// Flux joueur : send-otp → SMS → saisie code → verify-otp → session
// Dev mode : si TWILIO ou Redis non configuré, OTP retourné dans la réponse
// ============================================================

const OTP_TTL_SECONDS = 300;       // 5 minutes
const OTP_MAX_ATTEMPTS = 5;
const OTP_RATE_LIMIT_WINDOW = 60;  // 1 envoi par minute

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─────────────────────────────────────────────
// Détection mode dev (services non configurés)
// ─────────────────────────────────────────────

function isTwilioConfigured(): boolean {
  const sid = process.env.TWILIO_ACCOUNT_SID ?? '';
  return sid.length > 10 && sid !== 'TODO';
}

function isRedisConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? '';
  return url.startsWith('https://') && url !== 'TODO';
}

// ─────────────────────────────────────────────
// Stockage OTP — Redis si dispo, sinon mémoire
// ─────────────────────────────────────────────

// Fallback in-memory (lambda / single-process uniquement — ok pour dev/beta)
const memStore = new Map<string, { value: string; expiresAt: number }>();

function memGet(key: string): string | null {
  const entry = memStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { memStore.delete(key); return null; }
  return entry.value;
}

function memSet(key: string, value: string, ttlSeconds: number): void {
  memStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

function memDel(key: string): void { memStore.delete(key); }

function memIncr(key: string, ttlSeconds: number): number {
  const cur = parseInt(memGet(key) ?? '0', 10);
  const next = cur + 1;
  memSet(key, next.toString(), ttlSeconds);
  return next;
}

// Abstraction Redis / mémoire
async function store() {
  if (!isRedisConfigured()) {
    return {
      get: (key: string) => Promise.resolve(memGet(key)),
      set: (key: string, value: string, opts?: { ex: number }) => { memSet(key, value, opts?.ex ?? 300); return Promise.resolve(); },
      del: (key: string) => { memDel(key); return Promise.resolve(); },
      incr: (key: string) => Promise.resolve(memIncr(key, OTP_TTL_SECONDS)),
      expire: (key: string, ttl: number) => {
        const v = memGet(key);
        if (v) memSet(key, v, ttl);
        return Promise.resolve();
      },
    };
  }
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return {
    get: (key: string) => redis.get<string>(key),
    set: (key: string, value: string, opts?: { ex: number }) => redis.set(key, value, opts ? { ex: opts.ex } : undefined),
    del: (key: string) => redis.del(key),
    incr: (key: string) => redis.incr(key),
    expire: (key: string, ttl: number) => redis.expire(key, ttl),
  };
}

function otpKey(phone: string): string { return `otp:${phone}`; }
function otpAttemptsKey(phone: string): string { return `otp_attempts:${phone}`; }
function otpRateLimitKey(phone: string): string { return `otp_rate:${phone}`; }

// ─────────────────────────────────────────────
// sendOtp — envoie un code OTP par SMS
// Retourne devCode si Twilio non configuré (dev/beta)
// ─────────────────────────────────────────────

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string; devCode?: string }> {
  const db = await store();

  // Rate limit
  const rateLimitExists = await db.get(otpRateLimitKey(phone));
  if (rateLimitExists) {
    return { success: false, error: 'Veuillez attendre avant de renvoyer un code' };
  }

  const code = generateOtp();

  await db.set(otpKey(phone), code, { ex: OTP_TTL_SECONDS });
  await db.set(otpRateLimitKey(phone), '1', { ex: OTP_RATE_LIMIT_WINDOW });
  await db.del(otpAttemptsKey(phone));

  // Twilio non configuré → dev mode
  if (!isTwilioConfigured()) {
    console.log(`[OTP DEV] ${phone} → ${code}`);
    return { success: true, devCode: code };
  }

  // Envoi SMS via Twilio
  try {
    const twilio = (await import('twilio')).default;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      body: `BarCoins — Votre code : ${code} (valable 5 min)`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });

    return { success: true };
  } catch (err) {
    console.error('[sendOtp] Erreur Twilio:', err);
    await db.del(otpKey(phone));
    return { success: false, error: "Impossible d'envoyer le SMS" };
  }
}

// ─────────────────────────────────────────────
// verifyOtp — vérifie le code saisi par le joueur
// ─────────────────────────────────────────────

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const db = await store();

  const attempts = parseInt((await db.get(otpAttemptsKey(phone))) as string ?? '0', 10);
  if (attempts >= OTP_MAX_ATTEMPTS) return false;

  const storedCode = await db.get(otpKey(phone));
  if (!storedCode || storedCode !== code) {
    await db.incr(otpAttemptsKey(phone));
    await db.expire(otpAttemptsKey(phone), OTP_TTL_SECONDS);
    return false;
  }

  await db.del(otpKey(phone));
  await db.del(otpAttemptsKey(phone));
  return true;
}
