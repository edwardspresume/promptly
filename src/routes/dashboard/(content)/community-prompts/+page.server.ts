import { getCommunityPrompts } from '$databaseDir/databaseUtils.server';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const communityPrompts = getCommunityPrompts();

	return { communityPrompts };
}) satisfies PageServerLoad;
