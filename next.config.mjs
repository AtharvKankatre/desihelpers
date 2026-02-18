/** @type {import('next').NextConfig} */
import nextTranslate from 'next-translate-plugin';
const nextConfig = {
  reactStrictMode: true,
  ...nextTranslate(),
};

export default nextConfig;
