import type { PageServerLoad } from './$types';

import { getUserPrompts } from '$databaseDir/databaseUtils.server';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	const userPrompts = getUserPrompts(session?.user.id);

	return { userPrompts };
}) satisfies PageServerLoad;
