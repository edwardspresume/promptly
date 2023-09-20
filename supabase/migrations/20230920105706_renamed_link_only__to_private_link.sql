-- Step 1: Remove the default value from the column
alter table "public"."prompts_table" alter column "visibility" drop default;


-- Step 2: Rename the existing enum type
alter type "public"."prompt_visibility" rename to "prompt_visibility__old_version_to_be_dropped";


-- Step 3: Create a new enum type with the updated values
create type "public"."prompt_visibility" as enum ('Private', 'Public', 'Private-Link');

-- Step 4: Update the column type in your table to use the new enum, and map the old enum values to the new ones
ALTER TABLE "public"."prompts_table"
ALTER COLUMN "visibility"
TYPE "public"."prompt_visibility"
USING (
    CASE
        WHEN "visibility" = 'Private' THEN 'Private'::"public"."prompt_visibility"
        WHEN "visibility" = 'Public' THEN 'Public'::"public"."prompt_visibility"
        WHEN "visibility" = 'Link-Only' THEN 'Private-Link'::"public"."prompt_visibility"
    END
);


-- Step 5: Set a default value for the column
alter table "public"."prompts_table" alter column "visibility" set default 'Private'::prompt_visibility;


-- Step 6: Drop the old enum type
drop type "public"."prompt_visibility__old_version_to_be_dropped";
