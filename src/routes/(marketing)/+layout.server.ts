import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

import { RoutePaths } from '$globalTypes';

export const load = (async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (session) throw redirect(303, RoutePaths.DASHBOARD_PROMPTS);
}) satisfies LayoutServerLoad;
