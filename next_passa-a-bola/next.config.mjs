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
};

export default nextConfig; // Ou module.exports = nextConfig;
