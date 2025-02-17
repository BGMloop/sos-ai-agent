const path = require('path');

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
    },
    optimizePackageImports: [
      '@clerk/nextjs',
      '@langchain/anthropic',
      '@langchain/community'
    ]
  },
  webpack: (config, { isServer }) => {
    // Optimize string serialization
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
    }

    // Improve build performance with absolute path
    config.cache = {
      type: 'filesystem',
      version: `${isServer ? 'server' : 'client'}-1`,
      cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
      store: 'pack',
      buildDependencies: {
        config: [__filename],
      }
    }

    return config
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

module.exports = nextConfig;