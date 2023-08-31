import { desc, eq } from 'drizzle-orm';
import { drizzleClient } from './drizzleClient.server';

import { profilesTable, promptsTable, tagsTable } from './schema';

export type FormStatusMessage = { statusType: 'error' | 'success' | 'warning'; text: string };

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
		console.error(error);
		throw new Error('Error checking email existence');
	}
}

/**
 * Fetch the user profile based on the userId.
 * @param {string} userId - The ID of the user.
 * @returns Returns the user profile or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getUserProfile(userId: string) {
	try {
		const userProfile = await drizzleClient
			.select({
				email: profilesTable.email,
				username: profilesTable.username,
				fullName: profilesTable.fullName,
				avatarUrl: profilesTable.avatarUrl
			})
			.from(profilesTable)
			.where(eq(profilesTable.id, userId));

		return userProfile[0] ?? null;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching user profile');
	}
}

/**
 * Fetch the user prompts based on the userId.
 * @param {string} userId - The ID of the user.
 * @returns Returns the user prompts or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getUserPrompts(userId: string) {
	try {
		const userPrompts = await drizzleClient
			.select()
			.from(promptsTable)
			.where(eq(promptsTable.userId, userId))
			.orderBy(desc(promptsTable.createdAt));

		return userPrompts ?? null;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching user prompts');
	}
}

/**
 * Fetch the user tags based on the userId.
 * @param {string} userId - The ID of the user.
 * @returns Returns the user tags or null if not found.
 * @throws Will throw an error if the query fails.
 */
export async function getUserTags(userId: string) {
	try {
		const userTags = await drizzleClient
			.select()
			.from(tagsTable)
			.where(eq(tagsTable.userId, userId))
			.orderBy(desc(tagsTable.createdAt));

		return userTags ?? null;
	} catch (error) {
		console.error(error);
		throw new Error('Error fetching user tags');
	}
}
