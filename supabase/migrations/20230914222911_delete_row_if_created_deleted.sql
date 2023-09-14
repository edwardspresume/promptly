alter table "public"."tag_prompt_link_table" drop constraint "tag_prompt_link_table_created_by_fkey";

alter table "public"."tag_prompt_link_table" drop constraint "tag_prompt_link_table_pkey";

drop index if exists "public"."tag_prompt_link_table_pkey";

alter table "public"."tag_prompt_link_table" disable row level security;

CREATE UNIQUE INDEX tag_prompt_link_table_pkey ON public.tag_prompt_link_table USING btree (prompt_id, tag_id, created_by);

alter table "public"."tag_prompt_link_table" add constraint "tag_prompt_link_table_pkey" PRIMARY KEY using index "tag_prompt_link_table_pkey";

alter table "public"."tag_prompt_link_table" add constraint "tag_prompt_link_table_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles_table(id) ON DELETE CASCADE not valid;

alter table "public"."tag_prompt_link_table" validate constraint "tag_prompt_link_table_created_by_fkey";


