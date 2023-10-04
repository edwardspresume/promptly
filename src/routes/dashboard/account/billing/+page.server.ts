import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { profilesTable } from '$databaseDir/schema';
import { eq } from 'drizzle-orm';

import { stripeClient } from '$lib/global/stripe.server';

import { RoutePaths } from '$globalTypes';
import { logError } from '$globalUtils';

export const actions: Actions = {
	default: async ({ url, locals: { getSession } }) => {
		const userId = (await getSession())?.user.id;

		if (!userId) return;

		let stripeCustomerId: string | null | undefined = null;
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

			const userProfile = await drizzleClient.query.profilesTable.findFirst({
				where: eq(profilesTable.id, userId),

				columns: {
					stripeCustomerId: true
				}
			});

			stripeCustomerId = userProfile?.stripeCustomerId;

			if (!stripeCustomerId) throw new Error('User does not have a stripe customer id');

			const customerBillingPortal = await stripeClient.billingPortal.sessions.create({
				customer: stripeCustomerId,
				configuration: billingPortalConfig.id,
				return_url: `${url.origin}${RoutePaths.DASHBOARD_BILLING}`
			});

			billingPortalURL = customerBillingPortal.url;
		} catch (error) {
			logError(error, 'Billing Portal Error', { stripeCustomerId });
		}

		if (billingPortalURL) throw redirect(303, billingPortalURL);
	}
};
