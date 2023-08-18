import type { z } from 'zod';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import {
    boolean,
    pgEnum,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

export const keyStatus = pgEnum('key_status', [
    'default',
    'valid',
    'invalid',
    'expired',
]);
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
    'stream_xchacha20',
]);
export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', [
    's256',
    'plain',
]);
export const promptVisibility = pgEnum('prompt_visibility', [
    'private',
    'public',
]);
export const subscriptionPlan = pgEnum('subscription_plan', [
    'free',
    'pro',
    'enterprise',
]);

export const profiles = pgTable(
    'profiles',
    {
        id: uuid('id').primaryKey().notNull(),
        username: text('username'),
        email: varchar('email').notNull(),
        fullName: text('full_name'),
        avatarUrl: text('avatar_url'),
        isActive: boolean('is_active').default(true).notNull(),
        subscriptionPlan: subscriptionPlan('subscription_plan')
            .default('free')
            .notNull(),
        lastLogin: timestamp('last_login', {
            withTimezone: true,
            mode: 'string',
        })
            .defaultNow()
            .notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .defaultNow()
            .notNull(),
    },
    (table) => {
        return {
            profilesUsernameKey: unique('profiles_username_key').on(
                table.username
            ),
            profilesEmailKey: unique('profiles_email_key').on(table.email),
        };
    }
);

export const prompts = pgTable('prompts', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    title: text('title').notNull(),
    text: text('text').notNull(),
    isFavorited: boolean('is_favorited').default(false).notNull(),
    tagIds: uuid('tag_ids').array(),
    visibility: promptVisibility('visibility').default('private').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
        .defaultNow()
        .notNull(),
});

export const tags = pgTable(
    'tags',
    {
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        userId: uuid('user_id').notNull(),
        name: text('name').notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .defaultNow()
            .notNull(),
    },
    (table) => {
        return {
            uniqueUserTagName: unique('unique_user_tag_name').on(
                table.userId,
                table.name
            ),
        };
    }
);

const selectPromptsSchema = createSelectSchema(prompts);
const selectTagsSchema = createSelectSchema(tags);

export type PromptSchema = z.infer<typeof selectPromptsSchema>;
export type TagSchema = z.infer<typeof selectTagsSchema>;



export const promptsCrudSchema = createInsertSchema(prompts);
