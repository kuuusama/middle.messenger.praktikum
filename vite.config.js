import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "dist"),
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
        },
    },
    plugins: [
        handlebars({
            partialDirectory: [
                resolve(__dirname, "./src/shared/components/button"),
                resolve(__dirname, "./src/shared/components/input"),
                resolve(__dirname, "./src/shared/components/link"),
                resolve(__dirname, "./src/shared/components/linkbutton"),
                resolve(__dirname, "./src/components/login"),
                resolve(__dirname, "./src/components/register"),
                resolve(__dirname, "./src/components/chat"),
                resolve(__dirname, "./src/components/profile"),
                resolve(__dirname, "./src/components/404"),
            ],
        }),
    ],
});
