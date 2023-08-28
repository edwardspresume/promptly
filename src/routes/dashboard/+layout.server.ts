import { superValidate } from 'sveltekit-superforms/server';

import type { LayoutServerLoad } from './$types';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { getUserProfile } from '$databaseDir/utils.server';

export const load = (async ({ request, locals: { getSession } }) => {
	const feedbackForm = await superValidate(request, FeedbackValidationSchema);

	const userId = (await getSession())?.user.id;

	if (userId) {
		try {
			const userProfile = await getUserProfile(userId);

			return { feedbackForm, userProfile };
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	}

	return { feedbackForm };
}) satisfies LayoutServerLoad;
