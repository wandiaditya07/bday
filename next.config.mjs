/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Wajib export ke HTML statis
  images: {
    unoptimized: true,
  },
  // Masukkan nama repository baru Anda di sini
  basePath: '/bday',
  assetPrefix: '/bday',
};

export default nextConfig;
