import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
