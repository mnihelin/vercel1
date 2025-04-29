/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api-maps.yandex.ru'], // Yandex Maps için alan adını ekliyoruz
  },
  output: 'standalone',
};

module.exports = nextConfig;
