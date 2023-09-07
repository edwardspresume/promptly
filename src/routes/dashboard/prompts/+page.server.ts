import type { z } from 'zod';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable } from '$databaseDir/schema';
import { eq } from 'drizzle-orm';

import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import type { FormStatusMessage } from '$databaseDir/utils.server';

type FormData = z.infer<typeof PromptsValidationSchema>;

export const load = (async () => {
	const promptForm = await superValidate(PromptsValidationSchema);
	return { promptForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createOrUpdatePrompt: async ({ request, locals: { getSession } }) => {
		const promptForm = await superValidate<typeof PromptsValidationSchema, FormStatusMessage>(
			request,
			PromptsValidationSchema
		);

		if (!promptForm.valid) {
			return message(promptForm, {
				statusType: 'error',
				text: 'The prompt you entered is invalid. Please enter a valid prompt.'
			});
		}

		const session = await getSession();
		const promptId = promptForm.data.id;

		if (session) {
			try {
				const formData = Object.fromEntries(
					Object.entries(promptForm.data).filter(([, value]) => value !== undefined)
				) as FormData;

				if (promptId) {
					// Remove 'id' from formData
					delete formData.id;

					await drizzleClient
						.update(promptsTable)
						.set(formData)
						.where(eq(promptsTable.id, promptId));
				} else {
					await drizzleClient
						.insert(promptsTable)
						.values({ profileId: session.user.id, ...formData });
				}
			} catch (error) {
				console.error(error);

				return message(promptForm, {
					statusType: 'error',
					text: `Unexpected error during prompt ${promptId ? 'update' : 'creation'}. Please retry.`
				});
			}
		}

		return message(promptForm, {
			statusType: 'success',
			text: `Prompt ${promptId ? 'updated' : 'created'} successfully!`
		});
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
			console.error(error);
			throw new Error('Failed to toggle favorite. Please try again.');
		}

		return { success: true };
	},

	refinePrompt: async ({ request, fetch }) => {
		type NewRefinedPrompt = FormStatusMessage & { refinedPrompt?: string };

		const promptForm = await superValidate<typeof PromptsValidationSchema, NewRefinedPrompt>(
			request,
			PromptsValidationSchema
		);

		if (!promptForm.valid) {
			return message(promptForm, {
				statusType: 'error',
				text: 'The prompt you entered is invalid. Please enter a valid prompt.'
			});
		}

		const { title: promptTitle, description: promptDescription } = promptForm.data;

		try {
			const response = await fetch('./api/refinePrompt', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ promptTitle, promptDescription })
			});

			if (response.status !== 200) {
				throw new Error(response.statusText);
			}

			const refinedPrompt = await response.text();

			return message(promptForm, {
				statusType: 'success',
				text: response.statusText,
				refinedPrompt
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			return message(
				promptForm,
				{
					statusType: 'error',
					text: errorMessage
				},
				{
					status: 500
				}
			);
		}
	}
};
