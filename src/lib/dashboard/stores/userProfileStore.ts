import { writable } from 'svelte/store';

import type { ProfileSchema } from '$databaseDir/schema';

export const userProfileStore = writable<null | ProfileSchema>(null);
