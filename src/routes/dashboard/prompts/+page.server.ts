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
					await drizzleClient.insert(promptsTable).values({ userId: session.user.id, ...formData });
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
	}
};
