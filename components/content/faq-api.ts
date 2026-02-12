import { z } from 'zod';

const faqApiResponseSchema = z.object({
  answer: z.string().min(1),
});

export function extractApiAnswer(payload: unknown): string {
  const parsedPayload = faqApiResponseSchema.safeParse(payload);
  return parsedPayload.success ? parsedPayload.data.answer : '';
}
