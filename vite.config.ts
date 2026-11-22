import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Режим «artifact»: React підключається з CDN (cdnjs) глобальними змінними,
 * без service worker — для вбудованого перегляду на claude.ai.
 */
function reactGlobals(): Plugin {
  const map: Record<string, string> = {
    react: `const R = window.React; export default R;
export const { Children, Fragment, StrictMode, createContext, createElement, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } = R;`,
    'react/jsx-runtime': `const R = window.React; export const Fragment = R.Fragment;
export function jsx(type, props, key) { return R.createElement(type, key === undefined ? props : Object.assign({}, props, { key: key })); }
export const jsxs = jsx;`,
    'react-dom/client': `const D = window.ReactDOM; export const createRoot = D.createRoot; export default D;`,
  };
  return {
    name: 'react-globals',
    enforce: 'pre',
    resolveId(id) {
      if (id in map) return `\0rg:${id}`;
      return null;
    },
    load(id) {
      if (id.startsWith('\0rg:')) return map[id.slice(4)];
      return null;
    },
  };
}

/** Простий service worker: кешує всі файли збірки для роботи офлайн. */
function serviceWorker(): Plugin {
  return {
    name: 'offline-sw',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const files = Object.keys(bundle).filter((f) => !f.endsWith('.map'));
      const assets = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', ...files.map((f) => `./${f}`)];
      const version = Date.now().toString(36);
      const code = `const CACHE = 'gotuyu-sam-${version}';
const ASSETS = ${JSON.stringify([...new Set(assets)])};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) {
    // шрифти Google: кеш після першого завантаження
    if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
      e.respondWith(caches.open(CACHE).then((c) => c.match(req, { ignoreVary: true }).then((hit) => hit || fetch(req).then((res) => { c.put(req, res.clone()); return res; }))));
    }
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html', { ignoreVary: true })));
    return;
  }
  // ignoreVary: сервер може відповідати з «Vary: Origin», а скрипти-модулі запитуються з Origin
  e.respondWith(caches.match(req, { ignoreVary: true }).then((hit) => hit || fetch(req)));
});
`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: code });
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'artifact' ? [reactGlobals(), react()] : [react(), serviceWorker()],
  build: {
    outDir: mode === 'artifact' ? 'dist-artifact' : 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
}));
