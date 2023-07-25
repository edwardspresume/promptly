import { message, superValidate } from 'sveltekit-superforms/server';

import { fail } from '@sveltejs/kit';

import { FeedbackSchema } from '$utils/validation/feedbackSchema';

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, FeedbackSchema);

        return form.valid
            ? message(form, 'Feedback sent!')
            : fail(400, { form });
    },
};
