import { eq } from 'drizzle-orm';
import { drizzleClient } from './drizzleClient.server';

import { profilesTable } from './schemas/schema';

/**
 * Checks whether the given email exists in the profiles table.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean | null>} True if the email exists, false if not, null if an error occurred.
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
		// Return null to indicate an error in checking the email.
		return null;
	}
}
