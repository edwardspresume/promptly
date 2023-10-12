import { SECRET_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

import type { Actions, PageServerLoad } from './$types';

import { createClient } from '@supabase/supabase-js';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { customersTable } from '$databaseDir/schema';
import { eq } from 'drizzle-orm';

import { getStripeCustomerId, getUserPrompts } from '$databaseDir/databaseUtils.server';
import { logError } from '$globalUtils';

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SECRET_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

export const load = (async ({ locals: { getSession } }) => {
	const session = await getSession();

	const userPrompts = getUserPrompts(session?.user.id);

	return { userPrompts };
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteAccount: async ({ locals: { getSession, supabase } }) => {
		const userId = (await getSession())?.user.id;

		if (!userId) return;

		try {
			const stripeCustomerId = await getStripeCustomerId(userId);
			if (!stripeCustomerId) throw new Error('User does not have a stripe customer id');

			await drizzleClient.delete(customersTable).where(eq(customersTable.id, stripeCustomerId));

			await supabaseAdmin.auth.admin.deleteUser(userId);
			await supabase.auth.signOut();
		} catch (error) {
			logError(error, 'Delete Account Error', { userId });
		}
	}
};
