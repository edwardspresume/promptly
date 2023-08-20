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
			$globalStyles: 'src/styles/global.postcss',

			$marketingComponents: 'src/lib/marketing/components',
			$marketingUtils: 'src/lib/marketing/utils',

			$appComponents: 'src/lib/app/components',
			$appUtils: 'src/lib/app/utils',
			$appStores: 'src/lib/app/stores',
			$appData: 'src/lib/app/data',
			$appTypes: 'src/lib/app/types',

			$databaseDir: 'src/lib/app/database'
		}
	},

	vitePlugin: {
		inspector: true
	}
};

export default config;
