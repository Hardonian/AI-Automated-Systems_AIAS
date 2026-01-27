import { NextResponse } from "next/server";
import { Resend } from "resend";

import { logger } from "@/lib/logging/structured-logger";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resend = getResendClient();
    if (resend) {
      const data = await resend.emails.send({
        from: "AIAS Website <noreply@aiautomatedsystems.ca>",
        to: ["inquiries@aiautomatedsystems.ca"],
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

      return NextResponse.json(data);
    } else {
      // Fallback for when no API key is set (e.g. dev/preview)
      logger.info("Contact form submitted (simulation)", { name, email, message });
      return NextResponse.json({ success: true, simulated: true });
    }
  } catch (error) {
    logger.error(
      "Error sending email",
      error instanceof Error ? error : new Error(String(error))
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
