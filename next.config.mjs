import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    if (isProduction) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
      { source: '/manifest.json', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
      { source: '/_next/static/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/logo/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 95, 100],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 3600 : 60,
    unoptimized: process.env.NODE_ENV === 'development',
  },

  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  output: 'standalone',

  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);

    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        /^tap$/,
        /^why-is-node-running$/,
        /^desm$/,
        /^fastbench$/,
        /^pino-elasticsearch$/,
      ];

      const emptyModulePath = path.resolve(__dirname, 'lib/empty-module.js');

      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/test/,
          contextRegExp: /thread-stream$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /syntax-error\.mjs$/,
          contextRegExp: /thread-stream$/,
        }),
        new webpack.NormalModuleReplacementPlugin(
          /thread-stream\/test/,
          emptyModulePath
        ),
        new webpack.NormalModuleReplacementPlugin(
          /thread-stream\/bench/,
          emptyModulePath
        ),
        new webpack.NormalModuleReplacementPlugin(
          /thread-stream\/LICENSE/,
          emptyModulePath
        )
      );
    }

    return config;
  },
};

export default nextConfig;
