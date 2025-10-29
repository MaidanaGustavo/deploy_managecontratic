/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuração para rodar Next.js na porta 3001 (para não conflitar com Vite na 5173)
  env: {
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

}

export default nextConfig
