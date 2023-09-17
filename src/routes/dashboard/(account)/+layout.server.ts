import type { LayoutServerLoad } from './$types';

import { error } from '@sveltejs/kit';

export const load = (async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (!session) throw error(401, 'Please log in to access this page');
}) satisfies LayoutServerLoad;
