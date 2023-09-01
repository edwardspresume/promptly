import { drizzleClient } from '$databaseDir/drizzleClient.server';
import { promptsTable } from '$databaseDir/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
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
