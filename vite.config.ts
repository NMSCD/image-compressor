import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/Image-Compressor/',
	plugins: [
		vue(),
	],
    build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        spanish: resolve(__dirname, 'spanish.html'),
        english: resolve(__dirname, 'english.html'),
      },
    },
  },
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})


