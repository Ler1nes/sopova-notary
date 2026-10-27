import { build } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Сборка через JS API, без отдельного vite.config.ts:
 * так Vite не пытается запускать внешние команды при резолве путей.
 */
await build({
  configFile: false,
  root: process.cwd(),
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
  },
  logLevel: 'info',
});
