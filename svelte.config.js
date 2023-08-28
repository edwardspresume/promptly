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
			// General assets and styles
			$assets: 'src/assets',
			$globalStyles: 'src/styles/global.postcss',

			// Global aliases
			$globalComponents: 'src/lib/global/components',
			$globalUtils: 'src/lib/global/utils',
			$globalStores: 'src/lib/global/stores',
			$globalTypes: 'src/lib/global/types',

			// Auth aliases
			$authComponents: 'src/lib/auth/components',
			$authValidationSchemas: 'src/lib/auth/validations',

			// Marketing aliases
			$marketingComponents: 'src/lib/marketing/components',
			$marketingUtils: 'src/lib/marketing/utils',
			$marketingNavLinks: 'src/lib/marketing/navLinks.ts',

			// Dashboard aliases
			$dashboardComponents: 'src/lib/dashboard/components',
			$dashboardUtils: 'src/lib/dashboard/utils',
			$dashboardStores: 'src/lib/dashboard/stores',
			$dashboardData: 'src/lib/dashboard/data',
			$dashboardTypes: 'src/lib/dashboard/types',
			$dashboardValidationSchemas: 'src/lib/dashboard/validations',
			$dashboardNavLinks: 'src/lib/dashboard/navLinks.ts',

			// Database aliases
			$databaseDir: 'src/lib/database'
		}
	},

	vitePlugin: {
		inspector: true
	}
};

export default config;
