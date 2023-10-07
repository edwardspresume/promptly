import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

import { RoutePaths } from '$globalTypes';

export const prerender = true;

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (session) throw redirect(303, RoutePaths.DASHBOARD_PROMPTS);
}) satisfies LayoutServerLoad;
