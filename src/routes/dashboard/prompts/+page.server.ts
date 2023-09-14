import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { tagPromptLinkTable, promptsTable } from '$databaseDir/schema';
import { eq } from 'drizzle-orm';

import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import type { AlertMessage } from '$globalTypes';

import {
	PromptsValidationSchema,
	type PromptFormData
} from '$dashboardValidationSchemas/promptsValidationSchema';
import {
	insertPromptTagRelations,
	sanitizeContentOnServer,
	sanitizePromptData
} from '$databaseDir/utils.server';
import { logError } from '$globalUtils';

const ERROR_INVALID_PROMPT = 'The prompt you entered is invalid. Please enter a valid prompt.';

async function createPrompt(profileId: string, promptData: PromptFormData) {
	// Start transaction
	await drizzleClient.transaction(async (trx) => {
		const result = await trx
			.insert(promptsTable)
			.values({ profileId, ...promptData })
			.returning({ id: promptsTable.id });

		const newPromptId = result[0]?.id;

		// Insert new tag relations for this prompt
		await insertPromptTagRelations(trx, profileId, newPromptId, promptData.tagIds);
	});
}

async function updatePrompt(profileId: string, promptId: string, promptData: PromptFormData) {
	// Start transaction
	await drizzleClient.transaction(async (trx) => {
		// Remove 'id' from promptData
		delete promptData.id;

		// Update the prompt
		await trx.update(promptsTable).set(promptData).where(eq(promptsTable.id, promptId));

		// Delete all existing tag relations for this prompt
		await trx.delete(tagPromptLinkTable).where(eq(tagPromptLinkTable.promptId, promptId));

		// Insert new tag relations for this prompt
		await insertPromptTagRelations(trx, profileId, promptId, promptData.tagIds);
	});
}

export const load = (async () => {
	const promptForm = superValidate(PromptsValidationSchema);

	return { promptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createOrUpdatePrompt: async ({ request, locals: { getSession } }) => {
		const promptForm = await superValidate<typeof PromptsValidationSchema, AlertMessage>(
			request,
			PromptsValidationSchema
		);

		if (!promptForm.valid) {
			return message(promptForm, {
				alertType: 'error',
				alertText: ERROR_INVALID_PROMPT
			});
		}

		const userSession = (await getSession())?.user;
		const promptId = promptForm.data.id;

		if (userSession) {
			try {
				const sanitizedData = sanitizePromptData(promptForm.data);

				if (promptId) {
					await updatePrompt(userSession.id, promptId, sanitizedData);
				} else {
					await createPrompt(userSession.id, sanitizedData);
				}
			} catch (error) {
				logError(error, 'Error in createOrUpdatePrompt', { promptId, userSession });

				return message(
					promptForm,
					{
						alertType: 'error',
						alertText: `Unexpected error during prompt ${
							promptId ? 'update' : 'creation'
						}. Please retry.`
					},
					{ status: 500 }
				);
			}
		}

		return message(promptForm, {
			alertType: 'success',
			alertText: `Prompt ${promptId ? 'updated' : 'created'} successfully!`
		});
	},

	refinePrompt: async ({ request, fetch }) => {
		type NewRefinedPrompt = AlertMessage & { refinedPrompt?: string };

		const promptForm = await superValidate<typeof PromptsValidationSchema, NewRefinedPrompt>(
			request,
			PromptsValidationSchema
		);

		if (!promptForm.valid) {
			return message(promptForm, {
				alertType: 'error',
				alertText: ERROR_INVALID_PROMPT
			});
		}

		const { title: promptTitle, description: promptDescription } = promptForm.data;

		try {
			const response = await fetch('./api/refinePrompt', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					promptTitle: sanitizeContentOnServer(promptTitle),
					promptDescription: sanitizeContentOnServer(promptDescription)
				})
			});

			if (response.status >= 400) {
				throw new Error(response.statusText);
			}

			const refinedPrompt = await response.text();

			return message(promptForm, {
				alertType: 'success',
				alertText: response.statusText,
				refinedPrompt
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			return message(
				promptForm,
				{
					alertType: 'error',
					alertText: errorMessage
				},
				{
					status: 500
				}
			);
		}
	},

	toggleFavorite: async ({ request }) => {
		const formData = await request.formData();

		const isFavorited = formData.get('isFavorited') === 'true';
		const promptId = formData.get('promptId')?.toString();

		try {
			if (promptId) {
				await drizzleClient
					.update(promptsTable)
					.set({ isFavorited })
					.where(eq(promptsTable.id, promptId));
			} else {
				throw new Error('Prompt ID is not defined.');
			}
		} catch (error) {
			logError(error, 'Error in toggleFavorite', { promptId, isFavorited });

			throw new Error('Failed to toggle favorite. Please try again.');
		}

		return { success: true };
	}
};
