import type { PageServerLoad } from './$types';

import { error, type Actions } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';

import { getSharedPrompt, saveSharedPrompt } from '$databaseDir/databaseUtils.server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';

export const load = (async ({ params }) => {
	const { id: promptId } = params;

	try {
		const sharedPrompt = await getSharedPrompt(promptId);

		if (!sharedPrompt) throw new Error('Prompt not found');

		const sharedPromptForm = superValidate(
			{
				title: sharedPrompt.title,
				description: sharedPrompt.description
			},
			PromptsValidationSchema
		);

		return {
			sharedPrompt,
			sharedPromptForm
		};
	} catch (err) {
		throw error(404, 'Prompt not found');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => await saveSharedPrompt(event)
};
