import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { getCommunityPrompts, saveSharedPrompt } from '$databaseDir/databaseUtils.server';

export const load = (async () => {
	const communityPrompts = getCommunityPrompts();

	const communityPromptForm = superValidate(PromptsValidationSchema);

	return { communityPrompts, communityPromptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => await saveSharedPrompt(event, false)
};
