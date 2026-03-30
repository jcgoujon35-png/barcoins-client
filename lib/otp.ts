// ============================================================
// BARCOINS — OTP SMS via Twilio + Redis
// Flux joueur : send-otp → SMS → saisie code → verify-otp → session
// ============================================================

import twilio from 'twilio';

// Redis Upstash (lazy import pour éviter crash si pas configuré)
async function getRedis() {
  const { Redis } = await import('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const OTP_TTL_SECONDS = 300;       // 5 minutes
const OTP_MAX_ATTEMPTS = 5;        // max tentatives par phone
const OTP_RATE_LIMIT_WINDOW = 60;  // 1 envoi par minute par numéro

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpKey(phone: string): string {
  return `otp:${phone}`;
}

function otpAttemptsKey(phone: string): string {
  return `otp_attempts:${phone}`;
}

function otpRateLimitKey(phone: string): string {
  return `otp_rate:${phone}`;
}

// ─────────────────────────────────────────────
// sendOtp — envoie un code OTP par SMS
// ─────────────────────────────────────────────

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const redis = await getRedis();

  // Rate limit : 1 SMS par minute par numéro
  const rateLimitExists = await redis.get(otpRateLimitKey(phone));
  if (rateLimitExists) {
    return { success: false, error: 'Veuillez attendre avant de renvoyer un code' };
  }

  const code = generateOtp();

  // Stockage OTP en Redis (TTL 5min)
  await redis.set(otpKey(phone), code, { ex: OTP_TTL_SECONDS });

  // Rate limit (1 min)
  await redis.set(otpRateLimitKey(phone), '1', { ex: OTP_RATE_LIMIT_WINDOW });

  // Réinitialisation compteur tentatives
  await redis.del(otpAttemptsKey(phone));

  // Envoi SMS via Twilio
  try {
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
    // Nettoyage Redis en cas d'échec d'envoi
    await redis.del(otpKey(phone));
    return { success: false, error: "Impossible d'envoyer le SMS" };
  }
}

// ─────────────────────────────────────────────
// verifyOtp — vérifie le code saisi par le joueur
// ─────────────────────────────────────────────

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const redis = await getRedis();

  // Vérification du nombre de tentatives
  const attempts = parseInt((await redis.get(otpAttemptsKey(phone))) as string ?? '0', 10);
  if (attempts >= OTP_MAX_ATTEMPTS) {
    return false;
  }

  const storedCode = await redis.get(otpKey(phone));
  if (!storedCode || storedCode !== code) {
    await redis.incr(otpAttemptsKey(phone));
    await redis.expire(otpAttemptsKey(phone), OTP_TTL_SECONDS);
    return false;
  }

  // Code valide → nettoyage
  await redis.del(otpKey(phone));
  await redis.del(otpAttemptsKey(phone));
  return true;
}
