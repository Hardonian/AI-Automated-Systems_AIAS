import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
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
    tsconfigPath: './tsconfig.json',
  },

  eslint: {
    ignoreDuringBuilds: true,
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

  turbopack: {
    root: __dirname,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
          exclude: ['error', 'warn', 'info'],
        }
        : false,
  },

  // Security headers configured in vercel.json for static export compatibility

  productionBrowserSourceMaps: false,
  generateEtags: true,

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  webpack: (config, { isServer, dev, nextRuntime }) => {
    if (isRemoteBuild) {
      config.cache = { type: 'memory' };
    }

    config.resolve.alias['@/components'] = path.resolve(rootDir, 'components');
    config.resolve.alias['@/lib'] = path.resolve(rootDir, 'lib');
    config.resolve.alias['@/app'] = path.resolve(rootDir, 'app');
    config.resolve.alias['@/src'] = path.resolve(rootDir, 'src');
    config.resolve.alias['@'] = rootDir;

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        sideEffects: true,
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
