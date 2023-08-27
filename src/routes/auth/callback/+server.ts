import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { RoutePaths } from '$globalTypes';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	throw redirect(303, RoutePaths.DASHBOARD_PROMPTS);
};
