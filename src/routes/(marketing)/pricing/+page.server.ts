import type { PageServerLoad } from './$types';

import { stripeClient } from '$lib/global/stripe.server';

export const load = (async () => {
	const { data: prices } = await stripeClient.prices.list();

	const subscriptionPlans = [];

	for (const price of prices) {
		subscriptionPlans.push({
			id: price.id,
			amount: (price.unit_amount ?? 0) / 100,
			interval: price.recurring?.interval
		});
	}

	return { subscriptionPlans };
}) satisfies PageServerLoad;
