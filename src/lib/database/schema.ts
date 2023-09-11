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

export const keyStatus = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const keyType = pgEnum('key_type', [
	'aead-ietf',
	'aead-det',
	'hmacsha512',
	'hmacsha256',
	'auth',
	'shorthash',
	'generichash',
	'kdf',
	'secretbox',
	'secretstream',
	'stream_xchacha20'
]);
export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['s256', 'plain']);
export const subscriptionPlan = pgEnum('subscription_plan', ['free', 'pro', 'enterprise']);
export const promptVisibility = pgEnum('prompt_visibility', ['private', 'public']);

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
	tagIds: uuid('tag_ids').array(),
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
