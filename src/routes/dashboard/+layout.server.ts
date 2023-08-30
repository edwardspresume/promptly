import { superValidate } from 'sveltekit-superforms/server';

import type { LayoutServerLoad } from './$types';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { getUserProfile, getUserPrompts, getUserTags } from '$databaseDir/utils.server';

export const load = (async ({ request, locals: { getSession } }) => {
	const feedbackForm = superValidate(request, FeedbackValidationSchema);

	const userId = (await getSession())?.user.id;

	if (userId) {
		const userProfile = getUserProfile(userId);
		const userPrompts = getUserPrompts(userId);
		const userTags = getUserTags(userId);

		return { feedbackForm, userProfile, userPrompts, userTags };
	}

	return { feedbackForm };
}) satisfies LayoutServerLoad;
