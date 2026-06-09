// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";


import fs from 'fs';
import path from 'path';

function customPwaPlugin() {
  return {
    name: 'custom-pwa-generator',
    apply: 'build',
    closeBundle() {
      const clientDir = path.resolve(process.cwd(), 'dist/client');
      if (!fs.existsSync(clientDir)) return;
      
      const assetsDir = path.join(clientDir, 'assets');
      let assetFiles: string[] = [];
      if (fs.existsSync(assetsDir)) {
        assetFiles = fs.readdirSync(assetsDir)
          .filter(f => f.endsWith('.js') || f.endsWith('.css'))
          .map(f => `/assets/${f}`);
      }
      
      const swContent = `
const CACHE_NAME = 'nyc-tour-v3-${Date.now()}';
const PRECACHE_URLS = [
  '/', 
  '/manifest.webmanifest', 
  '/pwa-192x192.png', 
  '/pwa-512x512.png',
  ${assetFiles.map(f => `'${f}'`).join(',\n  ')}
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-While-Revalidate
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
    })
  );
});
`;
      fs.writeFileSync(path.join(clientDir, 'sw.js'), swContent);
      console.log('Custom Service Worker generated with ' + assetFiles.length + ' precached assets!');
    }
  }
}

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: true,
  plugins: [customPwaPlugin() as any]
});
