alter table "public"."prompts" drop constraint "prompts_user_id_fkey";

alter table "public"."tags" drop constraint "tags_user_id_fkey";

alter table "public"."prompts" add constraint "prompts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."prompts" validate constraint "prompts_user_id_fkey";

alter table "public"."tags" add constraint "tags_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."tags" validate constraint "tags_user_id_fkey";


