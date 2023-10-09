import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { RoutePaths } from '$globalTypes';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const previousRoute = url.searchParams.get('previousRoute');

	const redirectTo = previousRoute ?? RoutePaths.DASHBOARD_PROMPTS;

	console.log(url.origin + redirectTo);

	if (code) await supabase.auth.exchangeCodeForSession(code);

	throw redirect(303, url.origin + redirectTo);
};
