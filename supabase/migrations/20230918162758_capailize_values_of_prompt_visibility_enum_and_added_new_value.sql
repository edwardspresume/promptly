alter table "public"."prompts_table" alter column "visibility" drop default;

ALTER TYPE "public"."prompt_visibility" RENAME TO "prompt_visibility_old";

create type "public"."prompt_visibility" as enum ('Private', 'Public', 'Link-Only');

ALTER TABLE "public"."prompts_table"
ALTER COLUMN "visibility"
TYPE "public"."prompt_visibility"
USING (
    CASE "visibility"
        WHEN 'private' THEN 'Private'::"public"."prompt_visibility"
        WHEN 'public' THEN 'Public'::"public"."prompt_visibility"
    END
);

ALTER TABLE "public"."prompts_table" ALTER COLUMN "visibility" SET DEFAULT 'Private'::"public"."prompt_visibility";

DROP TYPE "public"."prompt_visibility_old";
