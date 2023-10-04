import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { RoutePaths } from '$globalTypes';

import { ALLOWED_SUBSCRIPTION_STATUSES } from '$dashboardTypes';
import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { getUserProfile, getUserTags } from '$databaseDir/databaseUtils.server';

export const load: LayoutServerLoad = async ({ locals: { getSession }, url }) => {
	const userId = (await getSession())?.user.id;
	const feedbackForm = superValidate(FeedbackValidationSchema);

	if (!userId) return { feedbackForm };

	// Fetch data concurrently
	const [userProfile, userTags] = await Promise.all([getUserProfile(userId), getUserTags(userId)]);

	const shouldRedirect =
		!ALLOWED_SUBSCRIPTION_STATUSES.includes(userProfile?.subscriptionStatus ?? '') &&
		url.pathname !== RoutePaths.DASHBOARD_ACCOUNT &&
		url.pathname !== RoutePaths.DASHBOARD_BILLING;

	if (shouldRedirect) throw redirect(303, RoutePaths.DASHBOARD_BILLING);

	return { userProfile, userTags, feedbackForm };
};
