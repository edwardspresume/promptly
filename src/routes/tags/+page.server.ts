import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

import TagValidationSchema from '$utils/validation/tagValidationSchema';

export const load = (async (event) => {
    const form = await superValidate(event, TagValidationSchema);

    return { form };
}) satisfies PageServerLoad;

export const actions = {
    createTag: async ({ request }) => {
        const form = await superValidate(request, TagValidationSchema);

        return form.valid ? message(form, 'Tag created!') : fail(400, { form });
    },

    updateTag: async ({ request }) => {
        const form = await superValidate(request, TagValidationSchema);

        return form.valid ? message(form, 'Tag updated!') : fail(400, { form });
    },
};
