import { message, superValidate } from 'sveltekit-superforms/server';

import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';
import type { Provider } from '@supabase/supabase-js';

const MESSAGES = {
    INVALID_EMAIL: 'Invalid email',
    SERVER_ERROR: 'Server error. Try again later',
    OATH_PROVIDER_ERROR: 'Provider not supported',
    SUCCESSFUL_LOGIN:
        'Check your email for a link to sign in. If it doesn’t appear within a few minutes, check your spam folder.',
};

const SUPPORTED_OAUTH_PROVIDERS = ['google'];

export const load = (async (event) => {
    const emailAuthForm = await superValidate(event, EmailAuthSchema);

    return { emailAuthForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signIn: async ({ request, url, locals: { supabase } }) => {
        const form = await superValidate(request, EmailAuthSchema);

        const oathProvider = url.searchParams.get('provider') as Provider;

        if (oathProvider) {
            if (!SUPPORTED_OAUTH_PROVIDERS.includes(oathProvider)) {
                return message(form, MESSAGES.OATH_PROVIDER_ERROR, {
                    status: 400,
                });
            }
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: oathProvider,
                options: {
                    redirectTo: `${url.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error(error);
                return message(form, MESSAGES.SERVER_ERROR, {
                    status: 500,
                });
            }

            throw redirect(303, data.url);
        }

        if (!form.valid) return message(form, MESSAGES.INVALID_EMAIL);

        const { email } = form.data;

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error(error);
            return message(form, MESSAGES.SERVER_ERROR, {
                status: 500,
            });
        }

        return message(form, MESSAGES.SUCCESSFUL_LOGIN);
    },
};
