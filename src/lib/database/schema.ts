import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const requestStatus = pgEnum('request_status', ['ERROR', 'SUCCESS', 'PENDING']);
export const keyStatus = pgEnum('key_status', ['expired', 'invalid', 'valid', 'default']);
export const keyType = pgEnum('key_type', [
	'stream_xchacha20',
	'secretstream',
	'secretbox',
	'kdf',
	'generichash',
	'shorthash',
	'auth',
	'hmacsha256',
	'hmacsha512',
	'aead-det',
	'aead-ietf'
]);
export const subscriptionPlan = pgEnum('subscription_plan', ['enterprise', 'pro', 'free']);
export const promptVisibility = pgEnum('prompt_visibility', ['public', 'private']);
export const factorType = pgEnum('factor_type', ['webauthn', 'totp']);
export const factorStatus = pgEnum('factor_status', ['verified', 'unverified']);
export const aalLevel = pgEnum('aal_level', ['aal3', 'aal2', 'aal1']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['plain', 's256']);

export const profilesTable = pgTable(
	'profiles',
	{
		id: uuid('id').primaryKey().notNull(),
		username: text('username'),
		email: varchar('email').notNull(),
		fullName: text('full_name'),
		avatarUrl: text('avatar_url'),
		isActive: boolean('is_active').default(true).notNull(),
		subscriptionPlan: subscriptionPlan('subscription_plan').default('free').notNull(),
		lastLogin: timestamp('last_login', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	(table) => {
		return {
			profilesUsernameKey: unique('profiles_username_key').on(table.username),
			profilesEmailKey: unique('profiles_email_key').on(table.email)
		};
	}
);

export const promptsTable = pgTable('prompts', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	profileId: uuid('profile_id')
		.notNull()
		.references(() => profilesTable.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	isFavorited: boolean('is_favorited').default(false).notNull(),
	tagIds: uuid('tag_ids').array().notNull(),
	visibility: promptVisibility('visibility').default('private').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

export const tagsTable = pgTable(
	'tags',
	{
		id: uuid('id').defaultRandom().primaryKey().notNull(),
		profileId: uuid('profile_id')
			.notNull()
			.references(() => profilesTable.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	(table) => {
		return {
			uniqueUserTagName: unique('unique_user_tag_name').on(table.profileId, table.name)
		};
	}
);

export type ProfileSchema = Pick<
	typeof profilesTable.$inferSelect,
	'username' | 'email' | 'fullName' | 'avatarUrl'
>;

export type PromptSchema = typeof promptsTable.$inferSelect;

export type TagSchema = typeof tagsTable.$inferSelect;
