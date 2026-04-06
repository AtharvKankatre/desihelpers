/** @type {import('next').NextConfig} */
import nextTranslate from 'next-translate-plugin';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...nextTranslate(),
  // PERF: Tree-shake large libraries — only import the specific components used
  modularizeImports: {
    'react-icons': { transform: 'react-icons/{{member}}' },
    '@mui/material': { transform: '@mui/material/{{member}}' },
    'react-bootstrap': { transform: 'react-bootstrap/{{member}}' },
  },
  images: {
    // PERF: Auto-serve optimized WebP/AVIF for all next/image components
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photos.desihelpers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prodapp.api.desihelpers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'devappapi.desihelpers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'desi-helpers-prod-bucket.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'desi-helpers-dev-bucket.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'projects.inpinitesolutions.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
