import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

import { createPOSTHandler } from '@/lib/api/route-handler';
import { emailSchema, nonEmptyStringSchema } from '@/lib/api/schemas';
import { logger } from '@/lib/logging/structured-logger';

// Standardized contact form schema
const contactFormSchema = z.object({
  name: nonEmptyStringSchema,
  email: emailSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
});

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

export const POST = createPOSTHandler(
  async context => {
    const { request } = context;
    const body = await request.json();
    const { name, email, message } = body;

    const resend = getResendClient();
    if (resend) {
      const data = await resend.emails.send({
        from: 'AIAS Website <noreply@aiautomatedsystems.ca>',
        to: ['inquiries@aiautomatedsystems.ca'],
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      logger.info('Contact form email sent', { name, email });
      return NextResponse.json(data);
    } else {
      // Fallback for when no API key is set (e.g. dev/preview)
      logger.info('Contact form submitted (simulation)', {
        name,
        email,
        message,
      });
      return NextResponse.json({ success: true, simulated: true });
    }
  },
  {
    requireAuth: false,
    validateBody: contactFormSchema,
  }
);
