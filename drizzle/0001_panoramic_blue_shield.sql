ALTER TABLE "tag_prompt_link_table" DROP CONSTRAINT "tag_prompt_link_table_pkey";--> statement-breakpoint
ALTER TABLE "prompts_table" DROP CONSTRAINT "prompts_table_profile_id_fkey";
--> statement-breakpoint
ALTER TABLE "tags_table" DROP CONSTRAINT "tags_table_profile_id_fkey";
--> statement-breakpoint
ALTER TABLE "tag_prompt_link_table" DROP CONSTRAINT "tag_prompt_link_table_created_by_fkey";
--> statement-breakpoint
ALTER TABLE "tag_prompt_link_table" DROP CONSTRAINT "tag_prompt_link_table_prompt_id_fkey";
--> statement-breakpoint
ALTER TABLE "tag_prompt_link_table" DROP CONSTRAINT "tag_prompt_link_table_tag_id_fkey";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompts_table" ADD CONSTRAINT "prompts_table_profile_id_profiles_table_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags_table" ADD CONSTRAINT "tags_table_profile_id_profiles_table_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag_prompt_link_table" ADD CONSTRAINT "tag_prompt_link_table_prompt_id_prompts_table_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "prompts_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag_prompt_link_table" ADD CONSTRAINT "tag_prompt_link_table_tag_id_tags_table_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag_prompt_link_table" ADD CONSTRAINT "tag_prompt_link_table_created_by_profiles_table_id_fk" FOREIGN KEY ("created_by") REFERENCES "profiles_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tag_prompt_link_table" ADD CONSTRAINT "tag_prompt_link_table_prompt_id_tag_id_created_by" PRIMARY KEY("prompt_id","tag_id","created_by");