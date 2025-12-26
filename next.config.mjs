/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // تنظیمات Turbopack (خالی برای استفاده از پیش‌فرض)
  turbopack: {},
  
  // PWA and Performance optimizations
  experimental: {
    // بهینه‌سازی package imports
    optimizePackageImports: ['lucide-react'],
  },
  
  // بهینه‌سازی prefetching
  // Next.js به صورت خودکار prefetch می‌کند برای لینک‌های visible
  // این تنظیمات باعث می‌شود prefetch سریع‌تر و کارآمدتر باشد

  // PWA headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
