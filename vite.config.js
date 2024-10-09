import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    build: {
        outDir: resolve(__dirname, 'dist'),
        // rollupOptions: {
        //     input: {
        //         main: resolve(__dirname, 'index.html'),
        //         nested: resolve(__dirname, 'register.html'),
        //       },
        // },
    },
    plugins: [
        handlebars({
            partialDirectory: [
                resolve(__dirname, './src/shared/components/button'),
                resolve(__dirname, './src/shared/components/input'),
                resolve(__dirname, './src/components/login'),
                resolve(__dirname, './src/components/register'),
                resolve(__dirname, './src/components/head'),
            ],
          }),
    ]
});




        // rollupOptions: {
        //     input: {
        //         main: resolve(__dirname, 'src/index.html'),
        //         nested: resolve(__dirname, 'src/register.html'),
        //       },
        // },

    