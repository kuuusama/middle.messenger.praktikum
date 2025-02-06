import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        viteStaticCopy({
          targets: [
            {
              src: 'assets',
              dest: ''
            }
          ]
        })
    ],
    esbuild: {
        keepNames: true
    },
    build: {
        outDir: resolve(__dirname, "dist"),
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
        },
    },
});
