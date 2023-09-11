import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable } from '$databaseDir/schema';
import { getPromptById } from '$databaseDir/utils.server';
import { RoutePaths, type AlertMessage } from '$globalTypes';
import { logError } from '$globalUtils';

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

export const actions: Actions = {
	default: async ({ params, locals: { getSession } }) => {
		const userSession = (await getSession())?.user;

		if (!userSession) return;

		const { id: promptId } = params;

		if (!promptId) throw error(404, 'Prompt id not provided');

		const promptData = await getPromptById(promptId);

		let alertMessage: AlertMessage;

		if (!promptData) {
			alertMessage = {
				alertType: 'error',
				alertText: 'Prompt not found'
			};

			return fail(400, alertMessage);
		}

		try {
			await drizzleClient.insert(promptsTable).values({
				profileId: userSession.id,
				title: promptData.title,
				description: promptData.description,
				tagIds: []
			});
		} catch (error) {
			logError(error, 'Error in saving shared prompt', { userSession });

			alertMessage = {
				alertType: 'error',
				alertText: 'Error in saving shared prompt. Please try again.'
			};

			return fail(400, alertMessage);
		}

		throw redirect(303, RoutePaths.DASHBOARD_PROMPTS);
	}
};
