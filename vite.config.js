import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
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
