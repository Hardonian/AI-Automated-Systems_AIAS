import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * OG Image Design Tokens
 * These colors mirror the design system in globals.css
 * but use hex format for ImageResponse compatibility
 */
const OG_COLORS = {
  // Primary brand - matches hsl(221.2 83.2% 53.3%)
  primary: '#3b82f6',
  // Dark backgrounds for contrast
  bgDark: '#0a0a0a',
  bgGradientTop: '#1a1a1a',
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'AI Automated Systems';
    const description =
      searchParams.get('description') ||
      'Custom AI Platform Development | Transform Your Business';

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: OG_COLORS.bgDark,
          backgroundImage: `linear-gradient(to bottom, ${OG_COLORS.bgGradientTop}, ${OG_COLORS.bgDark})`,
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
              color: OG_COLORS.textPrimary,
              marginBottom: '24px',
              lineHeight: '1.2',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: OG_COLORS.textSecondary,
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
              color: OG_COLORS.primary,
            }}
          >
            aiautomatedsystems.ca
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    return new Response(`Failed to generate image: ${error}`, {
      status: 500,
    });
  }
}
