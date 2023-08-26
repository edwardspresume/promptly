import type { profilesTable } from './schema';

export type ProfileSchema = Pick<
	typeof profilesTable.$inferSelect,
	'username' | 'email' | 'fullName' | 'avatarUrl'
>;
