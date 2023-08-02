import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [vitePreprocess({})],

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),

        alias: {
            $assets: 'src/assets',

            $dashboardComponents: 'src/routes/dashboard/components',
            $dashboardStores: 'src/routes/dashboard/stores',
            $dashboardUtils: 'src/routes/dashboard/utils',
            $dashboardData: 'src/routes/dashboard/data',
            $dashboardTypes: 'src/routes/dashboard/types',
            $dashboardAssets: 'src/routes/dashboard/assets',
        },
    },

    vitePlugin: {
        inspector: true,
    },
};

export default config;
