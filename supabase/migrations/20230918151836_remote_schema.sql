
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."prompt_visibility" AS ENUM (
    'private',
    'public'
);

ALTER TYPE "public"."prompt_visibility" OWNER TO "postgres";

CREATE TYPE "public"."subscription_plan" AS ENUM (
    'free',
    'pro',
    'enterprise'
);

ALTER TYPE "public"."subscription_plan" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_profile_on_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Insert the new user's ID and raw meta data (full name and avatar URL) into the profiles table.
  INSERT INTO public.profiles_table (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Return the new record.
  RETURN new;
END;
$$;

ALTER FUNCTION "public"."create_profile_on_signup"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."remove_tag_id_from_prompts"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompts_table') THEN
    UPDATE prompts_table
    SET tag_ids = array_remove(tag_ids, OLD.id)
    WHERE OLD.id = ANY(tag_ids) AND tag_ids IS NOT NULL;
  END IF;
  RETURN OLD;
END;
$$;

ALTER FUNCTION "public"."remove_tag_id_from_prompts"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."profiles_table" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "email" character varying NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "subscription_plan" "public"."subscription_plan" DEFAULT 'free'::"public"."subscription_plan" NOT NULL,
    "last_login" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "email_format_check" CHECK ((("email")::"text" ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'::"text"))
);

ALTER TABLE "public"."profiles_table" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prompts_table" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "is_favorited" boolean DEFAULT false NOT NULL,
    "tag_ids" "uuid"[],
    "visibility" "public"."prompt_visibility" DEFAULT 'private'::"public"."prompt_visibility" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."prompts_table" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tag_prompt_link_table" (
    "prompt_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."tag_prompt_link_table" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tags_table" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."tags_table" OWNER TO "postgres";

ALTER TABLE ONLY "public"."profiles_table"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."profiles_table"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles_table"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."prompts_table"
    ADD CONSTRAINT "prompts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tag_prompt_link_table"
    ADD CONSTRAINT "tag_prompt_link_table_pkey" PRIMARY KEY ("prompt_id", "tag_id", "created_by");

ALTER TABLE ONLY "public"."tags_table"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tags_table"
    ADD CONSTRAINT "unique_user_tag_name" UNIQUE ("profile_id", "name");

CREATE TRIGGER "remove_tag_id_from_prompts_trigger" AFTER DELETE ON "public"."tags_table" FOR EACH ROW EXECUTE FUNCTION "public"."remove_tag_id_from_prompts"();

CREATE TRIGGER "update_profile_timestamp" BEFORE UPDATE ON "public"."profiles_table" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();

CREATE TRIGGER "update_prompts_timestamp" BEFORE UPDATE ON "public"."prompts_table" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();

CREATE TRIGGER "update_tags_timestamp" BEFORE UPDATE ON "public"."tags_table" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();

ALTER TABLE ONLY "public"."profiles_table"
    ADD CONSTRAINT "profiles_table_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."prompts_table"
    ADD CONSTRAINT "prompts_table_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles_table"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tag_prompt_link_table"
    ADD CONSTRAINT "tag_prompt_link_table_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles_table"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tag_prompt_link_table"
    ADD CONSTRAINT "tag_prompt_link_table_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts_table"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tag_prompt_link_table"
    ADD CONSTRAINT "tag_prompt_link_table_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags_table"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tags_table"
    ADD CONSTRAINT "tags_table_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles_table"("id") ON DELETE CASCADE;

CREATE POLICY "Enable all actions for users based on id" ON "public"."profiles_table" TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable all actions for users based on profile_id" ON "public"."prompts_table" USING (("auth"."uid"() = "profile_id")) WITH CHECK (("auth"."uid"() = "profile_id"));

CREATE POLICY "Enable all actions for users based on profile_id" ON "public"."tags_table" USING (("auth"."uid"() = "profile_id")) WITH CHECK (("auth"."uid"() = "profile_id"));

ALTER TABLE "public"."profiles_table" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prompts_table" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tag_prompt_link_table" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tags_table" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_profile_on_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_profile_on_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_profile_on_signup"() TO "service_role";

GRANT ALL ON FUNCTION "public"."remove_tag_id_from_prompts"() TO "anon";
GRANT ALL ON FUNCTION "public"."remove_tag_id_from_prompts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."remove_tag_id_from_prompts"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";

GRANT ALL ON TABLE "public"."profiles_table" TO "anon";
GRANT ALL ON TABLE "public"."profiles_table" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles_table" TO "service_role";

GRANT ALL ON TABLE "public"."prompts_table" TO "anon";
GRANT ALL ON TABLE "public"."prompts_table" TO "authenticated";
GRANT ALL ON TABLE "public"."prompts_table" TO "service_role";

GRANT ALL ON TABLE "public"."tag_prompt_link_table" TO "anon";
GRANT ALL ON TABLE "public"."tag_prompt_link_table" TO "authenticated";
GRANT ALL ON TABLE "public"."tag_prompt_link_table" TO "service_role";

GRANT ALL ON TABLE "public"."tags_table" TO "anon";
GRANT ALL ON TABLE "public"."tags_table" TO "authenticated";
GRANT ALL ON TABLE "public"."tags_table" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
