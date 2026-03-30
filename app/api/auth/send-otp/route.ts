// POST /api/auth/send-otp
// Envoie un code OTP par SMS au joueur (étape 1 du login)

import { NextRequest, NextResponse } from 'next/server';
import { sendOtp } from '@/lib/otp';
import { parseBody, sendOtpSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }

  const parsed = parseBody(sendOtpSchema, body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { phone } = parsed.data;
  const result = await sendOtp(phone);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 429 });
  }

  return NextResponse.json({ success: true, message: 'Code envoyé par SMS' });
}
