import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { message, superValidate } from 'sveltekit-superforms/server';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable } from '$databaseDir/schema';
import { getPromptById, sanitizePromptData } from '$databaseDir/utils.server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { RoutePaths, type AlertMessage } from '$globalTypes';

import { logError } from '$globalUtils';

export const load = (async ({ params }) => {
	const { id: promptId } = params;

	try {
		const promptData = await getPromptById(promptId);

		const sharedPromptForm = await superValidate(promptData?.prompt, PromptsValidationSchema);

		return {
			sharedPromptForm,
			promptCreator: promptData?.creator?.username ?? promptData?.creator?.fullName ?? 'Anonymous'
		};
	} catch (err) {
		throw error(404, 'Prompt not found');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params, locals: { getSession } }) => {
		const userSession = (await getSession())?.user;

		if (!userSession) return;

		const { id: promptId } = params;

		if (!promptId) throw error(404, 'Prompt id not provided');

		const sharedPromptForm = await superValidate<typeof PromptsValidationSchema, AlertMessage>(
			request,
			PromptsValidationSchema
		);

		if (!sharedPromptForm.valid) {
			return message(sharedPromptForm, {
				alertType: 'error',
				alertText: 'The prompt you entered is invalid. Please enter a valid prompt.'
			});
		}

		try {
			const sanitizedData = sanitizePromptData(sharedPromptForm.data);

			await drizzleClient.insert(promptsTable).values({
				profileId: userSession.id,
				...sanitizedData
			});
		} catch (error) {
			logError(error, 'Error in createOrUpdatePrompt', { userSession });

			return message(
				sharedPromptForm,
				{
					alertType: 'error',
					alertText: 'Unexpected error during prompt creation. Please try again.'
				},
				{ status: 500 }
			);
		}

		throw redirect(303, RoutePaths.DASHBOARD_PROMPTS);
	}
};
