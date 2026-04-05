/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
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
    unoptimized: false,
  },
};

module.exports = nextConfig;
