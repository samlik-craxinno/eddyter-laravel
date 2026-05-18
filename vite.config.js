import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // Isolate Vite env files from the Laravel root `.env`. When both live in the same
    // directory, saving `.env` triggers a Vite server restart; on Vite 7 that can throw
    // ERR_SERVER_ALREADY_LISTEN. Laravel continues to use only the root `.env` for PHP.
    envDir: path.join(projectRoot, 'resources', 'vite'),
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/editor/basic.js',
                'resources/js/editor/lifecycle.js',
                'resources/js/editor/modal.js',
                'resources/js/blog/create.js',
                'resources/js/blog/multiple-editors.js',
                'resources/js/comments/feed.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
