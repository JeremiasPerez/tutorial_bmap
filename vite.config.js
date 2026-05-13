import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react(), 
    VitePWA({
      strategies: "injectManifest", // inyectar la lista de assets en el service worker automáticamente
      srcDir: "src", // carpeta donde está el service worker fuente
      filename: "sw.js", // nombre del fichero generado con el service worker (se traduce a dist/sw.js)
      registerType: "autoUpdate", // cuando haya una nueva versión del sw, actualizarlo automáticamente
      //injectRegister: "auto", // vite decide si hace falta o no inyectar el código para registrar el service worker
      includeAssets: [ // recursos (de la carpeta public) adicionales a cachear antes siquiera de registrar el serviceworker
        "manifest.json",
        // ...
      ]
  })],
  base: mode === 'production' ? '/tutorial_bmap' : '/',
  server: {
    host: true,
    strictPort: true,
    port: 5173
  }
}))
