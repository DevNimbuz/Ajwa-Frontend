/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ajwa-backend-1.onrender.com',
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowSVG: true,
    // In dev: let browser fetch from localhost:5000 directly (no optimizer proxy)
    // In prod: Vercel optimizer handles it using remotePatterns above
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;
