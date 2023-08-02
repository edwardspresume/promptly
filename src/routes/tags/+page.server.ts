import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { TagValidationSchema } from '$dashboardUtils/validation/tagValidationSchema';

export const load = (async (event) => {
    const tagForm = await superValidate(event, TagValidationSchema);

    return { tagForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createTag: async ({ request }) => {
        const form = await superValidate(request, TagValidationSchema);

        return form.valid
            ? message(form, 'Tag created!')
            : message(form, 'Invalid form');
    },

    updateTag: async ({ request }) => {
        const form = await superValidate(request, TagValidationSchema);

        return form.valid
            ? message(form, 'Tag updated!')
            : message(form, 'Invalid form');
    },
};
