import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

import OpenAI from 'openai';

import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable, tagPromptLinkTable } from '$databaseDir/schema';
import { eq } from 'drizzle-orm';

import { message, superValidate } from 'sveltekit-superforms/server';

import type { AlertMessage } from '$globalTypes';

import {
	PromptsValidationSchema,
	type PromptFormData
} from '$dashboardValidationSchemas/promptsValidationSchema';
import {
	getUserPrompts,
	insertPromptTagRelations,
	sanitizeContentOnServer,
	sanitizeFormData
} from '$databaseDir/databaseUtils.server';
import { logError } from '$globalUtils';

const ERROR_INVALID_PROMPT = 'The prompt you entered is invalid. Please enter a valid prompt.';

type PromptData = {
	promptTitle: string;
	promptDescription: string;
};

/**
 * Improves the quality of a given prompt using the OpenAI API.
 * @param {PromptData} promptData - The original title and description of the prompt.
 * @returns {Promise<string>} Refined description of the prompt.
 * @throws {Error} Throws an error if the API call fails or if environment variables are missing.
 */
async function fetchRefinedPrompt(promptData: PromptData) {
	const openai = new OpenAI({
		apiKey: SECRET_OPENAI_API_KEY
	});

	const { promptTitle, promptDescription } = promptData;

	const systemPrompt =
		'Given the title and description of a prompt, please output a refined version of the description that is clearer, more effective, and more detailed, while preserving its original meaning and intent. Please ensure that the output consists solely of the refined description, without any additional text, prefixes, or clarifications.';

	const userPrompt = `Prompt title: "${promptTitle}". Prompt description: "${promptDescription}"`;

	const params: OpenAI.Chat.ChatCompletionCreateParams = {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt }
		],

		model: 'gpt-4'
	};

	try {
		const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
		const refinedPrompt = completion.choices[0]?.message.content;

		return refinedPrompt;
	} catch (error) {
		logError(error, 'Error generating refined prompt', {
			promptData,
			params
		});

		throw new Error('Failed to generate refined prompt. Please try again.');
	}
}

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

export const load = (async ({ locals: { getSession } }) => {
	const userId = (await getSession())?.user.id;

	const promptForm = superValidate(PromptsValidationSchema);

	if (!userId) return { promptForm };

	const userPrompts = getUserPrompts(userId);

	return { userPrompts, promptForm };
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
				const sanitizedData = sanitizeFormData(promptForm.data);

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

	refinePrompt: async ({ request }) => {
		type NewRefinedPrompt = AlertMessage & { refinedPrompt?: string | null };

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
			const refinedPrompt = await fetchRefinedPrompt({
				promptTitle: sanitizeContentOnServer(promptTitle),
				promptDescription: sanitizeContentOnServer(promptDescription)
			});

			return message(promptForm, {
				alertType: 'success',
				alertText: 'Refined prompt successfully generated!',
				refinedPrompt
			});
		} catch (error) {
			return message(
				promptForm,
				{
					alertType: 'error',
					alertText: 'Internal Server Error. Failed to refine prompt.'
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
