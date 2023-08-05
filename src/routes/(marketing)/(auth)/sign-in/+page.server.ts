import type { Provider } from '@supabase/supabase-js';
import { superValidate } from 'sveltekit-superforms/server';

import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import {
    handleEmailSignIn,
    handleOauthSignIn,
} from '$marketingUtils/authHelpers.server';
import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

export const load = (async ({ request, locals: { getSession } }) => {
    const session = await getSession();
    const emailAuthForm = await superValidate(request, EmailAuthSchema);

    // If the user is already signed in, redirect them to the dashboard
    if (session) {
        throw redirect(303, '/dashboard');
    }

    return { emailAuthForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signIn: async ({ request, url, locals: { supabase } }) => {
        const form = await superValidate(request, EmailAuthSchema);

        const oathProvider = url.searchParams.get('provider') as Provider;

        if (oathProvider) {
            return await handleOauthSignIn(form, oathProvider, url, supabase);
        }

        return await handleEmailSignIn(form, url, supabase, false);
    },
};
