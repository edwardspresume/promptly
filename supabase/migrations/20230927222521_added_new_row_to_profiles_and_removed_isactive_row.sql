alter table "public"."profiles_table" drop column "is_active";

alter table "public"."profiles_table" add column "stripe_customer_id" text;


