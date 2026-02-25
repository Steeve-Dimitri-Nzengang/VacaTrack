export const pwaConfig = {
  name: "VacaTrack",
  short_name: "VacaTrack",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#4CAF50",
  icons: [
    {
      src: "icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
  cachingStrategies: {
    offline: {
      cacheName: "offline-cache",
      plugins: [
        {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      ]
    },
    precaching: {
      cacheName: "precache-v1",
      plugins: [
        {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      ]
    }
  },
  serviceWorker: {
    scope: "/",
    updateViaCache: "all"
  }
};