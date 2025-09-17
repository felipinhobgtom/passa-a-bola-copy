/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // ATENÇÃO: A configuração abaixo permite QUALQUER hostname.
        // Isso abre sua aplicação para possíveis vulnerabilidades de segurança.
        // Use com extrema cautela e apenas se entender os riscos.
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://backend:8000'}/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://backend:8000'}/api/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://backend:8000'}/auth/:path*`,
      },
    ];
  },
};

export default nextConfig; // Ou module.exports = nextConfig;
