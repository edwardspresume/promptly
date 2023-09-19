import { superValidate } from 'sveltekit-superforms/server';

import type { LayoutServerLoad } from './$types';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { getUserProfile, getUserTags } from '$databaseDir/databaseUtils.server';

export const load = (async ({ locals: { getSession } }) => {
	const userId = (await getSession())?.user.id;

	const feedbackForm = superValidate(FeedbackValidationSchema);

	if (userId) {
		const userProfile = getUserProfile(userId);

		const userTags = getUserTags(userId);

		return { userProfile, userTags, feedbackForm };
	}

	return { feedbackForm };
}) satisfies LayoutServerLoad;
