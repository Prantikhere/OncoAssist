/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This allows requests from the Firebase Studio development environment.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
  typescript: {
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
};

module.exports = nextConfig;
