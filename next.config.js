/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuração para rodar Next.js na porta 3001 (para não conflitar com Vite na 5173)
  env: {
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  // Production configuration - Next.js automatically serves files from public folder
  // The public folder contains the built Vite frontend (index.html, assets/, etc.)
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production'
    if (!isProduction) {
      return []
    }

    // In production, serve the Vite SPA for all non-API routes
    return {
      fallback: [
        {
          source: '/:path((?!api).*)*',
          destination: '/index.html',
        },
      ],
    }
  },
  // Disable CORS in production since frontend and backend are on same origin
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production'
    if (!isProduction) {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: process.env.FRONTEND_URL || 'http://localhost:5173' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
          ],
        },
      ]
    }
    return []
  },
}

export default nextConfig
