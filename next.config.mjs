/** @type {import('next').NextConfig} */
import nextTranslate from 'next-translate-plugin';
const nextConfig = {
  reactStrictMode: true,
  ...nextTranslate(),
  images: {
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
    ],
  },
};

export default nextConfig;
