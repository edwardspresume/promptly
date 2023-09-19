import { relations } from 'drizzle-orm';
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
export const factorType = pgEnum('factor_type', ['webauthn', 'totp']);
export const factorStatus = pgEnum('factor_status', ['verified', 'unverified']);
export const aalLevel = pgEnum('aal_level', ['aal3', 'aal2', 'aal1']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['plain', 's256']);
export const subscriptionPlan = pgEnum('subscription_plan', ['enterprise', 'pro', 'free']);
export const promptVisibility = pgEnum('prompt_visibility', ['Link-Only', 'Public', 'Private']);

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

export const promptsTable = pgTable('prompts_table', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	profileId: uuid('profile_id')
		.notNull()
		.references(() => profilesTable.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	isFavorited: boolean('is_favorited').default(false).notNull(),
	tagIds: uuid('tag_ids').array(),
	visibility: promptVisibility('visibility').default('Private').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
});

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
			.references(() => profilesTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	(table) => {
		return {
			tagPromptLinkTablePkey: primaryKey(table.promptId, table.tagId, table.createdBy)
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
	'id' | 'username' | 'email' | 'fullName' | 'avatarUrl'
>;

export type PromptSchema = typeof promptsTable.$inferSelect;

export type TagSchema = typeof tagsTable.$inferSelect;

export type SimplifiedTagSchema = Pick<TagSchema, 'id' | 'name'>;

export type SharablePromptSchema = {
	title: PromptSchema['title'];
	description: PromptSchema['description'];

	profile: Pick<ProfileSchema, 'username' | 'avatarUrl'>;

	tagPromptLink: {
		tag: {
			id: TagSchema['id'];
			name: TagSchema['name'];
		};
	}[];
};
