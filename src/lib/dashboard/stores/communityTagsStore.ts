import { writable } from 'svelte/store';

import type { SimplifiedTagSchema } from '$databaseDir/schema';

export const communityTagsStore = writable<SimplifiedTagSchema[]>([]);
