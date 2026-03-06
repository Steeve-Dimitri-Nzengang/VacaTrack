import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.GITHUB_ACTIONS ? '/VacaTrack/' : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'VacaTrack',
        short_name: 'VacaTrack',
        description: 'Dein persönlicher Reisebegleiter',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // SPA: alle Navigation-Requests → index.html (mit korrektem Basispfad)
        navigateFallback: base + 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Altes Cache sofort aufräumen
        cleanupOutdatedCaches: true,
        // Neuer SW übernimmt sofort
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  server: {
    open: true,
  },
});