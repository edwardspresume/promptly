import { loadFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';

import type { LayoutServerLoad } from './$types';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { getUserProfile } from '$databaseDir/databaseUtils.server';

export const load = loadFlash(async ({ locals: { getSession } }) => {
	const userId = (await getSession())?.user.id;

	const feedbackForm = superValidate(FeedbackValidationSchema);

	if (userId) {
		const userProfile = getUserProfile(userId);

		return { userProfile, feedbackForm };
	}

	return { feedbackForm };
}) satisfies LayoutServerLoad;
