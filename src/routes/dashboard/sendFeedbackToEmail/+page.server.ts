import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions } from './$types';

import type { AlertMessage } from '$globalTypes';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { sanitizeContentOnServer } from '$databaseDir/databaseUtils.server';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const feedbackForm = await superValidate<typeof FeedbackValidationSchema, AlertMessage>(
			request,
			FeedbackValidationSchema
		);

		if (!feedbackForm.valid) {
			return message(feedbackForm, {
				alertType: 'error',
				alertText: 'The message you entered is invalid. Please enter a valid message'
			});
		}

		const { message: feedbackMessage } = feedbackForm.data;

		const sanitizedMessage = sanitizeContentOnServer(feedbackMessage);

		try {
			const response = await fetch('./api/sendFeedbackToEmail', {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: sanitizedMessage
			});

			if (response.status >= 400) {
				throw new Error(response.statusText);
			}

			return message(feedbackForm, {
				alertType: 'success',
				alertText: response.statusText
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			return message(
				feedbackForm,
				{
					alertType: 'error',
					alertText: errorMessage
				},
				{
					status: 500
				}
			);
		}
	}
};
