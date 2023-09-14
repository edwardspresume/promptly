drop trigger if exists "update_profile_timestamp" on "public"."profiles";

drop trigger if exists "update_prompts_timestamp" on "public"."prompts";

drop trigger if exists "remove_tag_id_from_prompts_trigger" on "public"."tags";

drop trigger if exists "update_tags_timestamp" on "public"."tags";

drop policy "Enable all actions for users based on id" on "public"."profiles";

drop policy "Enable all actions for users based on profile_id" on "public"."prompts";

drop policy "Enable all actions for users based on profile_id" on "public"."tags";

alter table "public"."profiles" drop constraint "email_format_check";

alter table "public"."profiles" drop constraint "profiles_email_key";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."profiles" drop constraint "profiles_username_key";

alter table "public"."profiles" drop constraint "username_length";

alter table "public"."prompts" drop constraint "prompts_profile_id_fkey";

alter table "public"."tags" drop constraint "tags_profile_id_fkey";

alter table "public"."tags" drop constraint "unique_user_tag_name";

alter table "public"."profiles" drop constraint "profiles_pkey";

alter table "public"."prompts" drop constraint "prompts_pkey";

alter table "public"."tags" drop constraint "tags_pkey";

drop index if exists "public"."profiles_email_key";

drop index if exists "public"."profiles_pkey";

drop index if exists "public"."profiles_username_key";

drop index if exists "public"."prompts_pkey";

drop index if exists "public"."tags_pkey";

drop index if exists "public"."unique_user_tag_name";

drop table "public"."profiles";

drop table "public"."prompts";

drop table "public"."tags";

create table "public"."profiles_table" (
    "id" uuid not null,
    "username" text,
    "email" character varying not null,
    "full_name" text,
    "avatar_url" text,
    "is_active" boolean not null default true,
    "subscription_plan" subscription_plan not null default 'free'::subscription_plan,
    "last_login" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."profiles_table" enable row level security;

create table "public"."prompts_table" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "is_favorited" boolean not null default false,
    "tag_ids" uuid[],
    "visibility" prompt_visibility not null default 'private'::prompt_visibility,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."prompts_table" enable row level security;

create table "public"."tag_prompt_link_table" (
    "prompt_id" uuid not null,
    "tag_id" uuid not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."tag_prompt_link_table" enable row level security;

create table "public"."tags_table" (
    "id" uuid not null default gen_random_uuid(),
    "profile_id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."tags_table" enable row level security;

CREATE UNIQUE INDEX tag_prompt_link_table_pkey ON public.tag_prompt_link_table USING btree (prompt_id, tag_id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles_table USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles_table USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles_table USING btree (username);

CREATE UNIQUE INDEX prompts_pkey ON public.prompts_table USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags_table USING btree (id);

CREATE UNIQUE INDEX unique_user_tag_name ON public.tags_table USING btree (profile_id, name);

alter table "public"."profiles_table" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."prompts_table" add constraint "prompts_pkey" PRIMARY KEY using index "prompts_pkey";

alter table "public"."tag_prompt_link_table" add constraint "tag_prompt_link_table_pkey" PRIMARY KEY using index "tag_prompt_link_table_pkey";

alter table "public"."tags_table" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."profiles_table" add constraint "email_format_check" CHECK (((email)::text ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'::text)) not valid;

alter table "public"."profiles_table" validate constraint "email_format_check";

alter table "public"."profiles_table" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles_table" add constraint "profiles_table_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles_table" validate constraint "profiles_table_id_fkey";

alter table "public"."profiles_table" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles_table" add constraint "username_length" CHECK ((char_length(username) >= 1)) not valid;

alter table "public"."profiles_table" validate constraint "username_length";

alter table "public"."prompts_table" add constraint "prompts_table_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles_table(id) ON DELETE CASCADE not valid;

alter table "public"."prompts_table" validate constraint "prompts_table_profile_id_fkey";

alter table "public"."tag_prompt_link_table" add constraint "tag_prompt_link_table_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles_table(id) not valid;

alter table "public"."tag_prompt_link_table" validate constraint "tag_prompt_link_table_created_by_fkey";

alter table "public"."tag_prompt_link_table" add constraint "tag_prompt_link_table_prompt_id_fkey" FOREIGN KEY (prompt_id) REFERENCES prompts_table(id) ON DELETE CASCADE not valid;

alter table "public"."tag_prompt_link_table" validate constraint "tag_prompt_link_table_prompt_id_fkey";

alter table "public"."tag_prompt_link_table" add constraint "tag_prompt_link_table_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags_table(id) ON DELETE CASCADE not valid;

alter table "public"."tag_prompt_link_table" validate constraint "tag_prompt_link_table_tag_id_fkey";

alter table "public"."tags_table" add constraint "tags_table_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles_table(id) ON DELETE CASCADE not valid;

alter table "public"."tags_table" validate constraint "tags_table_profile_id_fkey";

alter table "public"."tags_table" add constraint "unique_user_tag_name" UNIQUE using index "unique_user_tag_name";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Insert the new user's ID and raw meta data (full name and avatar URL) into the profiles table.
  INSERT INTO public.profiles_table (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Return the new record.
  RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.remove_tag_id_from_prompts()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompts_table') THEN
    UPDATE prompts_table
    SET tag_ids = array_remove(tag_ids, OLD.id)
    WHERE OLD.id = ANY(tag_ids) AND tag_ids IS NOT NULL;
  END IF;
  RETURN OLD;
END;
$function$
;

create policy "Enable all actions for users based on id"
on "public"."profiles_table"
as permissive
for all
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Enable all actions for users based on profile_id"
on "public"."prompts_table"
as permissive
for all
to public
using ((auth.uid() = profile_id))
with check ((auth.uid() = profile_id));


create policy "Enable all actions for users based on profile_id"
on "public"."tags_table"
as permissive
for all
to public
using ((auth.uid() = profile_id))
with check ((auth.uid() = profile_id));


CREATE TRIGGER update_profile_timestamp BEFORE UPDATE ON public.profiles_table FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_prompts_timestamp BEFORE UPDATE ON public.prompts_table FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER remove_tag_id_from_prompts_trigger AFTER DELETE ON public.tags_table FOR EACH ROW EXECUTE FUNCTION remove_tag_id_from_prompts();

CREATE TRIGGER update_tags_timestamp BEFORE UPDATE ON public.tags_table FOR EACH ROW EXECUTE FUNCTION update_timestamp();


