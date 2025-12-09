/**
 * A/B Test Assignment API Endpoint
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createPOSTHandler } from '@/lib/api/route-handler';
import { abTestingService } from '@/lib/lead-generation/ab-testing';

const assignVariationSchema = z.object({
  testId: z.string().uuid(),
  visitorId: z.string(),
});

export const POST = createPOSTHandler(
  async (context) => {
    const body = assignVariationSchema.parse(await context.request.json());
    const tenantId = context.tenantId || undefined;
    
    const variationId = await abTestingService.assignVariation(
      body.testId,
      body.visitorId,
      tenantId
    );
    
    return NextResponse.json({ variationId });
  },
  {
    validateBody: assignVariationSchema,
  }
);
