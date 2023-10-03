import { PUBLIC_PRO_PLAN_PRICE_ID } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { eq } from 'drizzle-orm';

import { stripeClient } from '$lib/global/stripe.server';

import { getUserPrompts } from '$databaseDir/databaseUtils.server';
import { profilesTable } from '$databaseDir/schema';
import { RoutePaths } from '$globalTypes';
import { logError } from '$globalUtils';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	const userPrompts = getUserPrompts(session?.user.id);

	return { userPrompts };
}) satisfies PageServerLoad;

export const actions: Actions = {
	stripeCheckout: async ({ url, locals: { getSession } }) => {
		const userId = (await getSession())?.user.id;

		if (!userId) return;

		let stripeCustomerId: string | null | undefined = null;
		let stripeCheckOutURL: string | null = '';

		try {
			const userProfile = await drizzleClient.query.profilesTable.findFirst({
				where: eq(profilesTable.id, userId),

				columns: {
					stripeCustomerId: true
				}
			});

			stripeCustomerId = userProfile?.stripeCustomerId;

			if (!stripeCustomerId) throw new Error('User does not have a stripe customer id');

			const checkoutSession = await stripeClient.checkout.sessions.create({
				mode: 'subscription',
				customer: stripeCustomerId,
				client_reference_id: stripeCustomerId,
				payment_method_types: ['card', 'cashapp', 'paypal'],

				line_items: [
					{
						price: PUBLIC_PRO_PLAN_PRICE_ID,
						quantity: 1
					}
				],

				success_url: `${url.origin}${RoutePaths.DASHBOARD_ACCOUNT}?success=true`,
				cancel_url: `${url.origin}${RoutePaths.DASHBOARD_ACCOUNT}?canceled=true`
			});

			stripeCheckOutURL = checkoutSession.url;
		} catch (error) {
			logError(error, 'Error during Stripe operations', { stripeCustomerId });
		}

		if (stripeCheckOutURL) throw redirect(303, stripeCheckOutURL);
	}
};
