import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',

  plugins: [
    VitePWA({
      registerType: 'prompt',

      manifest: {
        id: '/',
        name: 'Chin Immanuel Church',
        short_name: 'CIC Nelson',
        description: 'Church bulletins, events and contact details',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f7f8fa',
        theme_color: '#2f5597',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}',
        ],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
    }),
  ],
})