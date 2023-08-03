import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

export const load = (async (event) => {
    const emailAuthForm = await superValidate(event, EmailAuthSchema);

    return { emailAuthForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    signUp: async ({ request }) => {
        const form = await superValidate(request, EmailAuthSchema);

        if (!form.valid) return message(form, 'Invalid form');

        return {
            status: 200,
            body: {
                message: 'success',
            },
        };
    },
};
