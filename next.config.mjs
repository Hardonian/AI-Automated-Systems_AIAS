import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isRemoteBuild =
  process.env.CI === 'true' ||
  process.env.VERCEL === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'export',
  distDir: 'out',

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      'framer-motion',
      'recharts',
      '@tanstack/react-query',
    ],
    webpackBuildWorker: true,
  },

  turbopack: {},

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
          exclude: ['error', 'warn', 'info'],
        }
        : false,
  },

  productionBrowserSourceMaps: false,
  generateEtags: true,

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  webpack: (config, { isServer }) => {
    if (isRemoteBuild) {
      config.cache = { type: 'memory' };
    }

    // Add path aliases for webpack resolution (resolve from workspace root)
    const rootDir = __dirname;
    config.resolve.alias['@/components'] = path.resolve(rootDir, 'components');
    config.resolve.alias['@/lib'] = path.resolve(rootDir, 'lib');
    config.resolve.alias['@/app'] = path.resolve(rootDir, 'app');
    config.resolve.alias['@'] = rootDir;

    return config;
  },
};

export default nextConfig;
