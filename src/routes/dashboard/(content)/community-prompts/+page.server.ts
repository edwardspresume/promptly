import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { getPublicPrompts, saveSharedPrompt } from '$databaseDir/databaseUtils.server';

export const load = (async () => {
	const communityPrompts = getPublicPrompts();

	const communityPromptForm = superValidate(PromptsValidationSchema);

	return { communityPrompts, communityPromptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => await saveSharedPrompt(event, false)
};
