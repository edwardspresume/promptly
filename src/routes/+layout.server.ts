import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load = loadFlash(async ({ locals: { getSession } }) => {
	return {
		session: await getSession()
	};
}) satisfies LayoutServerLoad;
