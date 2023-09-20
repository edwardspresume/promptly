import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { getPublicPrompts, saveSharedPrompt } from '$databaseDir/databaseUtils.server';

export const load = (async () => {
	const communityPrompts = await getPublicPrompts();

	const communityPromptForm = superValidate(PromptsValidationSchema);

	const tagMap = new Map();

	communityPrompts.flatMap((prompt) =>
		prompt.tagPromptLink.forEach((link) => tagMap.set(link.tag.name, link.tag))
	);

	const uniqueCommunityTags = [...tagMap.values()];

	return { communityPrompts, uniqueCommunityTags, communityPromptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => await saveSharedPrompt(event, false)
};
