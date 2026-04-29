import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'assets/icons/*.png'],
      manifest: {
        name: 'NCM',
        short_name: 'NCM',
        description: 'Premium Bakery and Confectionery in Manchester',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        shortcuts: [
          {
            name: 'View Menu',
            short_name: 'Menu',
            description: 'Browse our delicious treats',
            url: '/menu',
            icons: [{ src: '/assets/icons/logo192.png', sizes: '192x192' }]
          },
          {
            name: 'Track Order',
            short_name: 'Track',
            description: 'Check your order status',
            url: '/tracking',
            icons: [{ src: '/assets/icons/logo192.png', sizes: '192x192' }]
          },
          {
            name: 'Contact Us',
            short_name: 'Contact',
            description: 'Get in touch with us',
            url: '/contact',
            icons: [{ src: '/assets/icons/logo192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mp3}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(www\.googletagmanager\.com|www\.google-analytics\.com|firestore\.googleapis\.com|fonts\.googleapis\.com|cdnjs\.cloudflare\.com|fonts\.gstatic\.com|ik\.imagekit\.io)/i,
            handler: 'NetworkOnly'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        suppressWarnings: true
      }
    })
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  }
})
