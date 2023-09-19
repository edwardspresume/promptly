import type { PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { getCommunityPrompts } from '$databaseDir/databaseUtils.server';

export const load = (async () => {
	const communityPrompts = getCommunityPrompts();

	const communityPromptForm = superValidate(PromptsValidationSchema);

	return { communityPrompts, communityPromptForm };
}) satisfies PageServerLoad;
