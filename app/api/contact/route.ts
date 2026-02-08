import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(254)
    .trim()
    .toLowerCase(),
  company: z.string().max(200).trim().optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000)
    .trim(),
});

// Simple in-memory rate limiter (resets on restart — acceptable for serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return true;
  } // Skip if not configured
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      }
    );
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return true; // Fail open if Turnstile is unreachable
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Optional Turnstile verification
    if (body.turnstileToken) {
      const valid = await verifyTurnstile(body.turnstileToken as string);
      if (!valid) {
        return NextResponse.json(
          { ok: false, error: 'Bot verification failed. Please try again.' },
          { status: 403 }
        );
      }
    }

    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Invalid input';
      return NextResponse.json(
        { ok: false, error: firstError },
        { status: 400 }
      );
    }

    const { name, email, company, message } = result.data;

    // Test mode — skip email send
    const isTestMode = process.env.CONTACT_TEST_MODE === '1';
    if (isTestMode) {
      return NextResponse.json({ ok: true });
    }

    // Send email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail =
      process.env.CONTACT_TO_EMAIL || 'inquiries@aiautomatedsystems.ca';

    if (apiKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);

      await resend.emails.send({
        from: 'AIAS Website <noreply@aiautomatedsystems.ca>',
        to: [toEmail],
        reply_to: email,
        subject: `Contact: ${name}${company ? ` (${company})` : ''}`,
        text: [
          `Name: ${name}`,
          company ? `Company: ${company}` : '',
          `Email: ${email}`,
          '',
          `Message:`,
          message,
        ]
          .filter(Boolean)
          .join('\n'),
      });

      return NextResponse.json({ ok: true });
    }

    // No API key — log and succeed silently (dev/preview)
    console.info('[contact] submission received (no RESEND_API_KEY):', {
      name,
      email,
      company,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Something went wrong. Please try again or email us directly.',
      },
      { status: 500 }
    );
  }
}
