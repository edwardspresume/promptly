import type { LayoutServerLoad } from './$types';

import { getUserProfile } from '$databaseDir/utils.server';

export const load = (async ({ locals: { getSession } }) => {
	const userId = (await getSession())?.user.id;

	if (userId) {
		try {
			const userProfile = await getUserProfile(userId);

			return { userProfile };
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	}
}) satisfies LayoutServerLoad;
