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

			$globalComponents: '$lib/global/components',
			$globalUtils: '$lib/global/utils',
			$globalStores: '$lib/global/stores',
			$globalStyles: 'src/styles/global.postcss',

			$marketingComponents: '$lib/marketing/components',
			$marketingUtils: '$lib/marketing/utils',

			$appComponents: '$lib/app/components',
			$appUtils: '$lib/app/utils',
			$appStores: '$lib/app/stores',
			$appData: '$lib/app/data',
			$appTypes: '$lib/app/types',

			$databaseDir: '$lib/app/database'
		}
	},

	vitePlugin: {
		inspector: true
	}
};

export default config;
