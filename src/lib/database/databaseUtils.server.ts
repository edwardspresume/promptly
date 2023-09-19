import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import type * as schema from './schema';

import { and, desc, eq, ne } from 'drizzle-orm';
import { drizzleClient } from './drizzleClient.server';

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logError } from '$globalUtils';
import { profilesTable, promptsTable, tagPromptLinkTable, tagsTable } from './schema';

const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);

export const sanitizeContentOnServer = DOMPurifyInstance.sanitize;

type FormDataValues = string | number | boolean | null | File | Blob | string[] | undefined;

/**
 * This function sanitizes the form data by removing entries with undefined values
 * and sanitizing string values using the sanitizeContentOnServer function.
 *
 * @param formData - The object to be sanitized.
 * @returns - A new object with sanitized data.
 */
export function sanitizeFormData(formData: Record<string, FormDataValues>) {
	return Object.fromEntries(
		Object.entries(formData)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) =>
				typeof value === 'string' ? [key, sanitizeContentOnServer(value)] : [key, value]
			)
	);
}

/**
 * Checks whether the given email exists in the profiles table.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} True if the email exists, false if not.
 * @throws Will throw an error if the query fails.
 */
export async function checkEmailExists(email: string) {
	// Query the 'profiles' table to find a row where the email column matches the input email
	try {
		const queryResult = await drizzleClient
			.select({ email: profilesTable.email })
			.from(profilesTable)
			.where(eq(profilesTable.email, email));

		// If data.length is greater than 0, that means the email exists
		return queryResult.length > 0;
	} catch (error) {
		logError(error, 'Error checking email existence', {
			email
		});

		throw new Error('Error checking email existence');
	}
}

/**
 * Fetch the user profile based on the profileId.
 * @param {string} profileId - The ID of the profile.
 * @returns Returns the user profile or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getUserProfile(profileId: string | undefined) {
	if (!profileId) return null;

	try {
		const userProfile = await drizzleClient
			.select({
				id: profilesTable.id,
				email: profilesTable.email,
				username: profilesTable.username,
				fullName: profilesTable.fullName,
				avatarUrl: profilesTable.avatarUrl
			})
			.from(profilesTable)
			.where(eq(profilesTable.id, profileId));

		return userProfile[0] ?? null;
	} catch (error) {
		logError(error, 'Error fetching user profile', {
			profileId
		});

		throw new Error('Error fetching user profile');
	}
}

/**
 * Fetch the user prompts based on the profileId.
 * @param {string} profileId - The ID of the profile.
 * @returns Returns the user prompts or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getUserPrompts(profileId: string) {
	try {
		const userPrompts = await drizzleClient
			.select()
			.from(promptsTable)
			.where(eq(promptsTable.profileId, profileId))
			.orderBy(desc(promptsTable.createdAt));

		return userPrompts ?? null;
	} catch (error) {
		logError(error, 'Error fetching user prompts', {
			profileId
		});

		throw new Error('Error fetching user prompts');
	}
}

/**
 * Fetch the shared prompt based on the promptId.
 * @param {string} promptId - The ID of the shared prompt
 * @returns Returns the prompt or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getSharedPrompt(promptId: string) {
	try {
		const promptData = await drizzleClient.query.promptsTable.findFirst({
			where: and(eq(promptsTable.id, promptId), ne(promptsTable.visibility, 'Private')),

			columns: {
				title: true,
				description: true
			},
			with: {
				profile: {
					columns: {
						username: true,
						avatarUrl: true
					}
				},
				tagPromptLink: {
					columns: {},
					with: {
						tag: {
							columns: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		});

		return promptData ?? null;
	} catch (error) {
		logError(error, 'Error fetching prompt', {
			promptId
		});

		throw new Error('Error fetching prompt');
	}
}

/**
 * Fetch the community prompts that are made public.
 * @returns Returns the prompts or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getCommunityPrompts() {
	try {
		const promptsData = await drizzleClient.query.promptsTable.findMany({
			where: eq(promptsTable.visibility, 'Public'),
			orderBy: [desc(promptsTable.createdAt)],

			columns: {
				title: true,
				description: true
			},
			with: {
				profile: {
					columns: {
						username: true,
						avatarUrl: true
					}
				},
				tagPromptLink: {
					columns: {},
					with: {
						tag: {
							columns: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		});

		return promptsData ?? null;
	} catch (error) {
		logError(error, 'Error fetching community prompts');

		throw new Error('Error fetching community prompts');
	}
}

/**
 * Fetch the user tags based on the profileId.
 * @param {string} profileId - The ID of the profile.
 * @returns Returns the user tags or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getUserTags(profileId: string) {
	try {
		const userTags = await drizzleClient
			.select()
			.from(tagsTable)
			.where(eq(tagsTable.profileId, profileId))
			.orderBy(desc(tagsTable.createdAt));

		return userTags ?? null;
	} catch (error) {
		logError(error, 'Error fetching user tags', {
			profileId
		});

		throw new Error('Error fetching user tags');
	}
}

export async function insertPromptTagRelations(
	trx: PostgresJsDatabase<typeof schema>,
	createdBy: string,
	newPromptId: string | undefined,
	tagIds: string[] | null | undefined
) {
	if (newPromptId && tagIds?.length) {
		for (const tagId of tagIds) {
			await trx.insert(tagPromptLinkTable).values({ createdBy, promptId: newPromptId, tagId });
		}
	}
}
