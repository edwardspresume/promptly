import { superValidate } from 'sveltekit-superforms/server';

import type { LayoutServerLoad } from './$types';

import { FeedbackSchema } from '$dashboardUtils/validation/feedbackSchema';

export const load = (async (event) => {
    const feedbackForm = await superValidate(event, FeedbackSchema);

    return { feedbackForm };
}) satisfies LayoutServerLoad;
