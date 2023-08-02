import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions } from './$types';

import { FeedbackSchema } from '$dashboardUtils/validation/feedbackSchema';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const form = await superValidate(request, FeedbackSchema);

        if (!form.valid) return message(form, 'Invalid feedback message');

        const { message: feedbackMessage } = form.data;

        try {
            const response = await fetch('./api/sendFeedbackToEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: feedbackMessage,
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return message(form, 'Feedback sent!');
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error';

            throw error(500, {
                message: errorMessage,
            });
        }
    },
};
