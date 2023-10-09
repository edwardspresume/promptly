import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { stripeClient } from '$lib/global/stripe.server';

import { getStripeCustomerId } from '$databaseDir/databaseUtils.server';
import { RoutePaths } from '$globalTypes';
import { logError } from '$globalUtils';

export const actions: Actions = {
	default: async ({ url, locals: { getSession } }) => {
		const userId = (await getSession())?.user.id;

		if (!userId) return;

		let billingPortalURL: string | null = '';

		try {
			const stripeCustomerId = await getStripeCustomerId(userId);

			if (!stripeCustomerId) throw new Error('User does not have a stripe customer id');

			const customerBillingPortal = await stripeClient.billingPortal.sessions.create({
				customer: stripeCustomerId,
				return_url: `${url.origin}${RoutePaths.DASHBOARD_BILLING}`
			});

			billingPortalURL = customerBillingPortal.url;
		} catch (error) {
			logError(error, 'Billing Portal Error');
		}

		if (billingPortalURL) throw redirect(303, billingPortalURL);
	}
};
