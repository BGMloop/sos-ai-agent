/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    MISTRAL_API_KEY_AGENT: process.env.MISTRAL_API_KEY_AGENT,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true
    };
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "node-fetch": false,
        fs: false,
        path: false,
        crypto: false
      };
    }
    
    return config;
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

module.exports = nextConfig;