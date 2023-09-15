import { loadFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';

import type { LayoutServerLoad } from './$types';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { getUserProfile, getUserPrompts, getUserTags } from '$databaseDir/databaseUtils.server';

export const load = loadFlash(async ({ locals: { getSession } }) => {
	const feedbackForm = superValidate(FeedbackValidationSchema);

	const userId = (await getSession())?.user.id;

	if (userId) {
		const userProfile = getUserProfile(userId);
		const userPrompts = getUserPrompts(userId);
		const userTags = getUserTags(userId);

		return { feedbackForm, userProfile, userPrompts, userTags };
	}

	return { feedbackForm };
}) satisfies LayoutServerLoad;
