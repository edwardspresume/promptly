create policy "Enable all actions for users based on created_by"
on "public"."tag_prompt_link_table"
as permissive
for all
to public
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));



