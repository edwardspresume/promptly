import { eq } from 'drizzle-orm';
import { drizzleClient } from './drizzleClient.server';

import { profilesTable } from './schemas/schema';

export type FormStatusMessage = { status: 'error' | 'success' | 'warning'; text: string };


/**
 * Checks whether the given email exists in the profiles table.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} True if the email exists, false if not.
 * @throws Will throw an error if the query fails.
 */
export async function checkEmailExists(email: string) {
	// Query the 'profiles' table to find a row where the email column matches the input email
	try {
		const result = await drizzleClient
			.select({ email: profilesTable.email })
			.from(profilesTable)
			.where(eq(profilesTable.email, email));

		// If data.length is greater than 0, that means the email exists
		return result.length > 0;
	} catch (error) {
		console.error(error);
		throw new Error('Error checking email existence');
	}
}

/**
 * Fetch the user profile based on the userId.
 * @param {string} userId - The ID of the user.
 * @returns The user profile.
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
