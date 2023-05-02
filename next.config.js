/** @type {import('next').NextConfig} */
const nextConfig = {
  generateEtags: false,
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
