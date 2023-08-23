import adapter from '@sveltejs/adapter-auto';
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
			$globalUtils: 'src/lib/global/utils',
			$globalStores: 'src/lib/global/stores',
			$globalTypes: 'src/lib/global/types',
			$globalStyles: 'src/styles/global.postcss',

			$authComponents: 'src/lib/auth/components',
			$authSchemas: 'src/lib/auth/schemas',

			$marketingComponents: 'src/lib/marketing/components',
			$marketingUtils: 'src/lib/marketing/utils',

			$dashboardComponents: 'src/lib/dashboard/components',
			$dashboardUtils: 'src/lib/dashboard/utils',
			$dashboardStores: 'src/lib/dashboard/stores',
			$dashboardData: 'src/lib/dashboard/data',
			$dashboardTypes: 'src/lib/dashboard/types',

			$databaseDir: 'src/lib/dashboard/database'
		}
	},

	vitePlugin: {
		inspector: true
	}
};

export default config;
