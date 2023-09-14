import {
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
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
	'profiles_table',
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

export const promptsTable = pgTable('prompts_table', {
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
	'tags_table',
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

export const tagPromptLinkTable = pgTable(
	'tag_prompt_link_table',
	{
		promptId: uuid('prompt_id')
			.notNull()
			.references(() => promptsTable.id, { onDelete: 'cascade' }),
		tagId: uuid('tag_id')
			.notNull()
			.references(() => tagsTable.id, { onDelete: 'cascade' }),
		createdBy: uuid('created_by')
			.notNull()
			.references(() => profilesTable.id),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	(table) => {
		return {
			tagPromptLinkTablePkey: primaryKey(table.promptId, table.tagId)
		};
	}
);

export const profilesRelations = relations(profilesTable, ({ many }) => ({
	createdTagPromptLinks: many(tagPromptLinkTable)
}));

export const promptsRelations = relations(promptsTable, ({ one, many }) => ({
	profile: one(profilesTable, {
		fields: [promptsTable.profileId],
		references: [profilesTable.id]
	}),

	tagPromptLink: many(tagPromptLinkTable)
}));

export const tagsRelations = relations(tagsTable, ({ one, many }) => ({
	profile: one(profilesTable, {
		fields: [tagsTable.profileId],
		references: [profilesTable.id]
	}),

	tagPromptLink: many(tagPromptLinkTable)
}));

export const tagPromptLinkTableRelations = relations(tagPromptLinkTable, ({ one }) => ({
	profile: one(profilesTable, {
		fields: [tagPromptLinkTable.createdBy],
		references: [profilesTable.id]
	}),

	prompt: one(promptsTable, {
		fields: [tagPromptLinkTable.promptId],
		references: [promptsTable.id]
	}),

	tag: one(tagsTable, {
		fields: [tagPromptLinkTable.tagId],
		references: [tagsTable.id]
	})
}));

export type ProfileSchema = Pick<
	typeof profilesTable.$inferSelect,
	'username' | 'email' | 'fullName' | 'avatarUrl'
>;

export type PromptSchema = typeof promptsTable.$inferSelect;

export type TagSchema = typeof tagsTable.$inferSelect;
