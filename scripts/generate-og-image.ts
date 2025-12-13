#!/usr/bin/env tsx
/**
 * Generate OG Image
 * Creates Open Graph image for social sharing
 * 
 * Note: This is a template. In production, use a service like:
 * - Vercel OG Image Generation (https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation)
 * - Cloudinary
 * - Custom image generation service
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

/**
 * Generate OG image metadata
 * In production, this would generate an actual image file
 * For now, we'll create the route handler for Vercel OG Image Generation
 */
export function generateOGImageMetadata() {
  return {
    width: 1200,
    height: 630,
    alt: "AI Automated Systems — Custom AI Platform Development",
    type: "image/png",
  };
}

/**
 * Create OG image route handler for Vercel
 * This uses Vercel's @vercel/og package
 */
export const ogImageHandler = `
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'AI Automated Systems';
    const description = searchParams.get('description') || 'Custom AI Platform Development';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '24px',
                lineHeight: '1.2',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#a0a0a0',
                lineHeight: '1.5',
                maxWidth: '900px',
              }}
            >
              {description}
            </p>
            <div
              style={{
                display: 'flex',
                marginTop: '48px',
                fontSize: '24px',
                color: '#3b82f6',
              }}
            >
              aiautomatedsystems.ca
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(\`Failed to generate image: \${e.message}\`, {
      status: 500,
    });
  }
}
`;

if (require.main === module) {
  // Create OG image route
  const ogImageRoutePath = join(process.cwd(), "app", "api", "og", "route.tsx");
  const ogImageDir = join(process.cwd(), "app", "api", "og");
  
  try {
    mkdirSync(ogImageDir, { recursive: true });
    writeFileSync(ogImageRoutePath, ogImageHandler);
    console.log("✅ Created OG image route handler at:", ogImageRoutePath);
    console.log("\n📝 Next steps:");
    console.log("1. Install @vercel/og: pnpm add @vercel/og");
    console.log("2. Update app/layout.tsx to use /api/og?title=...&description=...");
    console.log("3. Test with: curl http://localhost:3000/api/og?title=Test");
  } catch (error) {
    console.error("Failed to create OG image route:", error);
    process.exit(1);
  }
}
