set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE stripe_customer_id TEXT;

BEGIN

  -- Insert a new row into stripe.customers table with the profile_id in the attrs field.
  INSERT INTO stripe.customers(email, name, description, attrs)
  VALUES (new.email, new.raw_user_meta_data->>'full_name', null, jsonb_build_object('metadata[profile_id]', new.id));
 

  -- Get the id of the newly inserted customer.
  stripe_customer_id := (SELECT id FROM stripe.customers WHERE attrs->'metadata'->>'profile_id' = new.id::TEXT);


    -- Insert the new user's ID and raw meta data (full name and avatar URL) into the profiles table.
    INSERT INTO public.profiles_table (id, email, full_name, avatar_url, stripe_customer_id)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', stripe_customer_id);
  
  -- Return the new record.
  RETURN new;
END;$function$
;


