import type { Provider, SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { SuperValidated } from 'sveltekit-superforms';
import { message } from 'sveltekit-superforms/server';

import type { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

type FormType = SuperValidated<typeof EmailAuthSchema>;

const MESSAGES = {
    INVALID_EMAIL:
        'The email you entered is invalid. Please enter a valid email address.',
    SERVER_ERROR: 'An error occurred on the server. Please try again later.',
    UNSUPPORTED_OAUTH_PROVIDER:
        'The selected sign-in provider is currently not supported. Please choose a different provider.',
    SUCCESSFUL_LOGIN: `A sign-in link has been sent to your email. If you don't see it within a few minutes, please check your spam folder.`,
    SUCCESSFUL_SIGNUP: `You have successfully signed up! Please check your email for a confirmation link. If you don't receive it within a few minutes, check your spam folder.`,
};

const SUPPORTED_OAUTH_PROVIDERS = ['google'];

/**
 * This function handles OAuth sign-in operations. It checks if the OAuth provider is supported,
 * initiates sign-in with the provider, and redirects to the provider's sign-in URL.
 *
 * @param {FormType} form - The validated form data.
 * @param {Provider} oathProvider - The OAuth provider for sign-in.
 * @param {URL} url - The request URL.
 * @param {SupabaseClient} supabase - The Supabase client.
 * @return {Promise} - The result of the OAuth sign-in operation.
 */
export const handleOauthSignIn = async (
    form: FormType,
    oathProvider: Provider,
    url: URL,
    supabase: SupabaseClient
) => {
    if (!SUPPORTED_OAUTH_PROVIDERS.includes(oathProvider)) {
        return message(form, MESSAGES.UNSUPPORTED_OAUTH_PROVIDER, {
            status: 400,
        });
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: oathProvider,
        options: { redirectTo: `${url.origin}/auth/callback` },
    });

    if (error) {
        console.error(error);
        return message(form, MESSAGES.SERVER_ERROR, { status: 500 });
    }

    throw redirect(303, data.url);
};

/**
 * This function handles email sign-in operations. It checks if the form data is valid,
 * initiates sign-in with the email, and sends an OTP to the email.
 *
 * @param {FormType} form - The validated form data.
 * @param {URL} url - The request URL.
 * @param {SupabaseClient} supabase - The Supabase client.
 * @return {Promise} - The result of the email sign-in operation.
 */
export const handleEmailSignIn = async (
    form: FormType,
    url: URL,
    supabase: SupabaseClient,
    isSignup: boolean
) => {
    if (!form.valid) return message(form, MESSAGES.INVALID_EMAIL);

    const { email } = form.data;

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${url.origin}/auth/callback` },
    });

    if (error) {
        console.error(error);
        return message(form, MESSAGES.SERVER_ERROR, { status: 500 });
    }

    return message(
        form,
        isSignup ? MESSAGES.SUCCESSFUL_SIGNUP : MESSAGES.SUCCESSFUL_LOGIN
    );
};
