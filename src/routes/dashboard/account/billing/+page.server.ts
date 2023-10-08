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
			const billingPortalConfig = await stripeClient.billingPortal.configurations.create({
				business_profile: {
					headline: 'Manage your Promptly billing settings'
				},

				features: {
					invoice_history: { enabled: true },
					payment_method_update: { enabled: true },

					customer_update: {
						allowed_updates: ['name', 'phone', 'address', 'tax_id'],
						enabled: true
					},

					subscription_cancel: {
						enabled: true,
						cancellation_reason: {
							enabled: true,
							options: ['customer_service', 'missing_features', 'too_expensive', 'unused']
						}
					}
				}
			});

			const stripeCustomerId = await getStripeCustomerId(userId);

			if (!stripeCustomerId) throw new Error('User does not have a stripe customer id');

			const customerBillingPortal = await stripeClient.billingPortal.sessions.create({
				customer: stripeCustomerId,
				configuration: billingPortalConfig.id,
				return_url: `${url.origin}${RoutePaths.DASHBOARD_BILLING}`
			});

			billingPortalURL = customerBillingPortal.url;
		} catch (error) {
			logError(error, 'Billing Portal Error');
		}

		if (billingPortalURL) throw redirect(303, billingPortalURL);
	}
};
