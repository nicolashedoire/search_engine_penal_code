/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Résoudre les problèmes de pdf.js
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          canvas: false,
          encoding: false,
        };
      }
      
      // Exclure pdfjs-dist côté serveur
      if (isServer) {
        config.externals = [...config.externals, 'canvas'];
      }
      
      return config;
    },
    // Désactiver le rendu côté serveur pour les composants avec PDF
    experimental: {
      esmExternals: 'loose',
    }
  };
  
  module.exports = nextConfig;