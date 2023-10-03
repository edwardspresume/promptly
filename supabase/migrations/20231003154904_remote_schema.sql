set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE stripe_customer_id TEXT;
DECLARE pro_plan_default_price_id TEXT;
DECLARE trial_end TIMESTAMP := NOW() + INTERVAL '7 days';


BEGIN

  -- Insert a new row into stripe.customers table with the profile_id in the attrs field.
  INSERT INTO stripe.customers_table(email, name, attrs)
  VALUES (new.email, new.raw_user_meta_data->>'full_name', jsonb_build_object('metadata[supabase_profile_id]', new.id));
 

  -- Get the id of the newly inserted customer.
  stripe_customer_id := (SELECT id FROM stripe.customers_table WHERE attrs->'metadata'->>'supabase_profile_id' = new.id::TEXT);

  -- Fetch the default price for the pro plan
  pro_plan_default_price_id := (select default_price from stripe.products_table limit 1);

  -- Insert into stripe.subscriptions
  INSERT INTO stripe.subscriptions_table(customer, attrs)
  VALUES (
    stripe_customer_id,
    jsonb_build_object(
      'items[0][price]', pro_plan_default_price_id,
      'payment_behavior', 'default_incomplete',
      'trial_end', EXTRACT(EPOCH FROM trial_end)::BIGINT,
      'trial_settings[end_behavior][missing_payment_method]', 'pause'
    )
  );


    -- Insert the new user's ID and raw meta data (full name and avatar URL) into the profiles table.
    INSERT INTO public.profiles_table(id, email, full_name, avatar_url, stripe_customer_id)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', stripe_customer_id);
  
  -- Return the new record.
  RETURN new;
END;$function$
;


