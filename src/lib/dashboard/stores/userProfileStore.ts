import { writable } from 'svelte/store';

import type { ProfileSchema } from '$databaseDir/schemas/profileSchema';

export const userProfileStore = writable<null | ProfileSchema>(null);
