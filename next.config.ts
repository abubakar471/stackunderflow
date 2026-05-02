import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages : ['pino', 'pino-pretty'],
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : 'static1.personalitydatabase.net',
        port  : ''
      }
    ]
  }
};

export default nextConfig;
