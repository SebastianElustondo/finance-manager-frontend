/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now the default in Next.js 13+, no need to specify
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  env: {
    CUSTOM_KEY: 'finance-manager',
  },
  // PWA configuration
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // Webpack configuration for better performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configurations if needed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  // Environment variables
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  // Redirects for better SEO
  async redirects() {
    return [
      // Removed redirect loop - dashboard page handles tabs internally
    ];
  },
  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 