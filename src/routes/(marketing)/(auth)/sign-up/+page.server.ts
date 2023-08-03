import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

const MESSAGES = {
    INVALID_EMAIL: 'Invalid email',
    SERVER_ERROR: 'Server error. Try again later',
    CHECK_EMAIL:
        'Please check your email for a magic link to log into the website.',
};

export const load = (async (event) => {
    const emailAuthForm = await superValidate(event, EmailAuthSchema);

    return { emailAuthForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signUp: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, EmailAuthSchema);

        if (!form.valid) return message(form, MESSAGES.INVALID_EMAIL);

        const { email } = form.data;

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: 'https://example.com/welcome',
            },
        });

        if (error) {
            return message(form, MESSAGES.SERVER_ERROR, {
                status: 500,
            });
        }

        return message(form, MESSAGES.CHECK_EMAIL);
    },
};
