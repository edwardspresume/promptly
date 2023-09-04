drop trigger if exists "remove_tag_id_from_prompts_trigger" on "public"."tags";

drop function if exists "public"."remove_tag_id_from_prompts"();

alter table "public"."prompts" alter column "tag_ids" set not null;


