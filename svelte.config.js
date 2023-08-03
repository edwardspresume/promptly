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
            $globalComponents: 'src/lib/components',
            $globalStyles: 'src/styles/global.postcss',

            $marketingUtils: 'src/routes/(marketing)/lib/utils',
            $marketingComponents: 'src/routes/(marketing)/lib/components',

            $dashboardComponents: 'src/routes/(app)/dashboard/lib/components',
            $dashboardStores: 'src/routes/(app)/dashboard/lib/stores',
            $dashboardUtils: 'src/routes/(app)/dashboard/lib/utils',
            $dashboardData: 'src/routes/(app)/dashboard/lib/data',
            $dashboardTypes: 'src/routes/(app)/dashboard/types',
            $dashboardAssets: 'src/routes/(app)/dashboard/assets',
        },
    },

    vitePlugin: {
        inspector: true,
    },
};

export default config;
