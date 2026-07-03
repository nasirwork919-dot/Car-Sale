import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      // Ignore agent/runtime state dirs so their constant log writes don't trigger full page reloads.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/.local/**', '**/.cache/**', '**/.git/**', '**/.agents/**'],
      },
      host: '0.0.0.0',
      allowedHosts: true as const,
    },
  };
});
