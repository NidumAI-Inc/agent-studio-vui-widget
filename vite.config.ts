import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import typescript from '@rollup/plugin-typescript'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    typescript(),
    svgr()
  ],
  css: {
    postcss: './postcss.config.js',
  },
  define: {
    'process.env': process.env
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'MyWidget',
      fileName: 'widget',
      formats: ['iife']
    },
    rollupOptions: {
      external: [],
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  base: '',
})