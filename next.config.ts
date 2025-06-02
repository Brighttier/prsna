import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !!! WARNING !!!
    // This ignores linting errors during the build process.
    // Consider removing this option for production builds.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['6000-firebase-studio-1747828800055.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev'],
};

export default nextConfig;
