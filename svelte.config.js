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

            $globalComponents: 'src/lib/global/components',
            $globalStores: 'src/lib/global/stores',
            $globalStyles: 'src/styles/global.postcss',

            $marketingUtils: 'src/lib/marketing/utils',
            $marketingComponents: 'src/lib/marketing/components',

            $dashboardComponents: 'src/lib/dashboard/components',
            $dashboardStores: 'src/lib/dashboard/stores',
            $dashboardUtils: 'src/lib/dashboard/utils',
            $dashboardData: 'src/lib/dashboard/data',
            $dashboardTypes: 'src/lib/dashboard/types',
        },
    },

    vitePlugin: {
        inspector: true,
    },
};

export default config;
