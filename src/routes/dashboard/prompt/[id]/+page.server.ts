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
} from '$databaseDir/databaseUtils.server';

import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';
import { RoutePaths, type AlertMessage } from '$globalTypes';

import { allTagsStore } from '$dashboardStores/tagsStore';
import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable, tagsTable, type TagSchema } from '$databaseDir/schema';
import { logError } from '$globalUtils';

/**
 * Finds a tag in the store by its name.
 * @param {string} tagName - The name of the tag to find.
 * @returns {TagSchema | undefined} - The tag if found, undefined if not.
 */
const findTagByName = (tagName: string) => {
	const normalizedName = tagName.trim().toLowerCase();

	// Get the current tags from the store
	const currentTags: TagSchema[] = get(allTagsStore);

	// Check if the tag exists in the store
	return currentTags.find((tag) => tag.name.toLowerCase() === normalizedName);
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
		const sharedTags = sharedPrompt.tagPromptLink.map((tagPromptLink) => tagPromptLink.tag);
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

			let existingTags: TagSchema[] = [];
			const newTags: { profileId: string; name: string }[] = [];

			// Separate existing and new tags
			for (const name of sharedTagNames) {
				const tagName = sanitizeContentOnServer(name.toString());
				const existingTag = findTagByName(tagName);

				if (existingTag) existingTags.push(existingTag);
				else newTags.push({ profileId: userSession.id, name: tagName });
			}

			// Filter out existing tags that are already included in sanitizedData.tagIds
			existingTags = existingTags.filter((tag) => !sanitizedData.tagIds.includes(tag.id));

			await drizzleClient.transaction(async (trx) => {
				const newTagIds = existingTags.map((tag) => tag.id);

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
				await insertPromptTagRelations(trx, userSession.id, newPromptId, sanitizedData.tagIds);
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
