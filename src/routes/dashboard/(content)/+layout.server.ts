import type { LayoutServerLoad } from './$types';

import { getUserTags } from '$databaseDir/databaseUtils.server';

export const load = (async ({ locals: { getSession } }) => {
	const userId = (await getSession())?.user.id;

	if (userId) {
		const userTags = getUserTags(userId);

		return { userTags };
	}
}) satisfies LayoutServerLoad;
