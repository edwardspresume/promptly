import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getPromptById } from '$databaseDir/utils.server';

export const load = (async ({ params }) => {
	const { id: promptId } = params;

	const promptData = await getPromptById(promptId);

	if (!promptData) throw error(404, 'Prompt not found');

	return {
		sharedPrompt: {
			title: promptData.title,
			description: promptData.description,
			fromUser: promptData.username ?? promptData.fullName ?? 'Anonymous'
		}
	};
}) satisfies PageServerLoad;
