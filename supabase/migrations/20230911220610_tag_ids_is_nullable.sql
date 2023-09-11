alter table "public"."prompts" alter column "tag_ids" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.remove_tag_id_from_prompts()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompts') THEN
    UPDATE prompts
    SET tag_ids = array_remove(tag_ids, OLD.id)
    WHERE OLD.id = ANY(tag_ids) AND tag_ids IS NOT NULL;
  END IF;
  RETURN OLD;
END;
$function$
;


