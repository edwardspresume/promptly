import type { PageServerLoad } from './$types';

import { error, type Actions } from '@sveltejs/kit';
import { get } from 'svelte/store';

import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms/server';

import {
	getSharedPrompt,
	insertPromptTagRelations,
	sanitizeContentOnServer,
	sanitizePromptData
} from '$databaseDir/utils.server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { RoutePaths, type AlertMessage } from '$globalTypes';

import { allTagsStore } from '$dashboardStores/tagsStore';
import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable, tagsTable } from '$databaseDir/schema';
import { logError } from '$globalUtils';

/**
 * Checks if a tag with a specific name exists in the list.
 * @param {string} tagName - Name of the tag to check.
 * @returns {boolean} - true if tag exists, false otherwise.
 */
const doesTagExistServerSideCheck = (tagName: string): boolean => {
	// Sanitize and normalize the tag name
	const sanitizedTagName = sanitizeContentOnServer(tagName);
	const normalizedName = sanitizedTagName.trim().toLowerCase();

	// Get the current tags from the store
	const currentTags = get(allTagsStore);

	// Check if the tag exists in the store
	return currentTags.some((tag) => tag.name.toLowerCase() === normalizedName);
};

export const load = (async ({ params }) => {
	const { id: promptId } = params;

	try {
		const sharedPrompt = await getSharedPrompt(promptId);

		if (!sharedPrompt) throw new Error('Prompt not found');

		const sharedPromptForm = await superValidate(
			{
				title: sharedPrompt.title,
				description: sharedPrompt.description
			},
			PromptsValidationSchema
		);

		// Extract the shared tags and creator details from the prompt data
		const sharedTags = sharedPrompt.promptTags.map((promptTags) => promptTags.tag);
		const promptCreator = {
			username: sharedPrompt.profile.username ?? sharedPrompt?.profile.fullName ?? 'Anonymous',
			avatarUrl: sharedPrompt.profile.avatarUrl ?? null
		};

		return {
			sharedPromptForm,
			promptCreator,
			sharedTags
		};
	} catch (err) {
		throw error(404, 'Prompt not found');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const {
			request,
			locals: { getSession }
		} = event;

		const userSession = (await getSession())?.user;

		if (!userSession) return;

		const formData = await request.formData();
		const sharedPromptForm = await superValidate<typeof PromptsValidationSchema, AlertMessage>(
			formData,
			PromptsValidationSchema
		);

		if (!sharedPromptForm.valid) {
			return message(sharedPromptForm, {
				alertType: 'error',
				alertText: 'The prompt you entered is invalid. Please enter a valid prompt.'
			});
		}

		try {
			// Sanitize the data received from the form that's base on the PromptValidationSchema
			const sanitizedData = sanitizePromptData(sharedPromptForm.data);

			// Get the shared tag names from the form data
			const sharedTagNames = formData.getAll('sharedTagNames');

			// Create an array of new tags after sanitizing the tag names and checking if they already exist
			const newTags = sharedTagNames
				.map((name) => sanitizeContentOnServer(name.toString()))
				.filter((tagName) => !doesTagExistServerSideCheck(tagName))
				.map((tagName) => ({ profileId: userSession.id, name: tagName }));

			await drizzleClient.transaction(async (trx) => {
				const newTagIds = [];

				// If there are new tags, insert them into the database and get their IDs
				if (newTags.length > 0) {
					const insertedTags = await trx
						.insert(tagsTable)
						.values(newTags)
						.returning({ id: tagsTable.id });

					newTagIds.push(...insertedTags.map((tag) => tag.id));
				}

				sanitizedData.tagIds = [...newTagIds, ...sanitizedData.tagIds];

				// Create a new prompt with the sanitized data and tag IDs
				const insertedPrompt = await trx
					.insert(promptsTable)
					.values({
						profileId: userSession.id,
						...sanitizedData
					})
					.returning({ id: promptsTable.id });

				// Get the ID of the newly created prompt
				const newPromptId = insertedPrompt[0]?.id;

				// Insert new tag relations for this prompt
				insertPromptTagRelations(trx, newPromptId, sanitizedData.tagIds);
			});
		} catch (error) {
			logError(error, 'Error when saving shared prompt', { userSession });

			return message(
				sharedPromptForm,
				{
					alertType: 'error',
					alertText: 'Unexpected error during prompt creation. Please try again.'
				},
				{ status: 500 }
			);
		}

		// On successful creation of the prompt, redirect the user to the prompts dashboard with a success message
		throw redirect(
			RoutePaths.DASHBOARD_PROMPTS,
			{
				alertType: 'success',
				alertText: 'Prompt successfully saved!'
			},
			event
		);
	}
};
