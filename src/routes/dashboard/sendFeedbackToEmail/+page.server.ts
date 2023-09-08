import { message, superValidate } from 'sveltekit-superforms/server';

import type { Actions } from './$types';

import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';
import { sanitizeContent, type FormStatusMessage } from '$databaseDir/utils.server';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const feedbackForm = await superValidate<typeof FeedbackValidationSchema, FormStatusMessage>(
			request,
			FeedbackValidationSchema
		);

		if (!feedbackForm.valid) {
			return message(feedbackForm, {
				statusType: 'error',
				text: 'The message you entered is invalid. Please enter a valid message'
			});
		}

		const { message: feedbackMessage } = feedbackForm.data;

		const sanitizedMessage = sanitizeContent(feedbackMessage);

		try {
			const response = await fetch('./api/sendFeedbackToEmail', {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: sanitizedMessage
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return message(feedbackForm, {
				statusType: 'success',
				text: response.statusText
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			return message(
				feedbackForm,
				{
					statusType: 'error',
					text: errorMessage
				},
				{
					status: 500
				}
			);
		}
	}
};
