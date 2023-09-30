create type "public"."subscription_status" as enum ('trialing', 'active', 'paused', 'ended', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired');

alter table "public"."profiles_table" add column "subscription_status" subscription_status not null default 'trialing'::subscription_status;


