/* eslint-disable @typescript-eslint/no-require-imports */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev to avoid annoying logs/cache
});

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Empty config to silence Turbopack/webpack conflict in Next.js 16
};

module.exports = withPWA(withNextIntl(nextConfig));

