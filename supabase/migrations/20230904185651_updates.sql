alter table "public"."prompts" alter column "tag_ids" drop not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.remove_tag_id_from_prompts()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE prompts
  SET tag_ids = array_remove(tag_ids, OLD.id)
  WHERE OLD.id = ANY(tag_ids);
  RETURN OLD;
END;
$function$
;

CREATE TRIGGER remove_tag_id_from_prompts_trigger AFTER DELETE ON public.tags FOR EACH ROW EXECUTE FUNCTION remove_tag_id_from_prompts();


