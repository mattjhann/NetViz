import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
//
// `base` controls the public path the built assets are served from.
//  - Default '/'  → Docker/nginx (served at the domain root).
//  - GitHub Pages → set VITE_BASE=/<repo>/ in the deploy workflow, because a
//    project Pages site is served from https://<user>.github.io/<repo>/.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
});
