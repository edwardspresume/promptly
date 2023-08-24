import type { Provider } from '@supabase/supabase-js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import type { FormStatusMessage } from '$globalTypes';

import { EmailAuthValidationSchema, OAuthProviderSchema } from '$authSchemas/authSchemas';

import { checkEmailExists } from '$databaseDir/utils.server';

const AUTH_MESSAGES = {
	INVALID_EMAIL: 'The email you entered is invalid. Please enter a valid email address.',

	SERVER_ERROR: 'An error occurred on the server. Please try again later.',

	UNSUPPORTED_OAUTH_PROVIDER:
		'The selected sign-in provider is currently not supported. Please choose a different provider.',

	SUCCESSFUL_LOGIN: `A sign-in link has been sent to your email. If you don't see it within a few minutes, please check your spam folder.`,

	SUCCESSFUL_SIGNUP: `You have successfully signed up! Please check your email for a confirmation link. If you don't receive it within a few minutes, check your spam folder.`
};

export const load: PageServerLoad = (event) => {
	const authEmailForm = superValidate(event, EmailAuthValidationSchema);
	const oAuthForm = superValidate(event, OAuthProviderSchema);

	return { authEmailForm, oAuthForm };
};

export const actions: Actions = {
	emailAuth: async ({ request, url, locals: { supabase } }) => {
		const authEmailForm = await superValidate<typeof EmailAuthValidationSchema, FormStatusMessage>(
			request,
			EmailAuthValidationSchema
		);

		if (!authEmailForm.valid) {
			return message(authEmailForm, {
				status: 'error',
				text: AUTH_MESSAGES.INVALID_EMAIL
			});
		}

		const formType = authEmailForm.data.formType;

		// Check if the email already exists when signing up.
		const isEmailExists = await checkEmailExists(authEmailForm.data.email);

		// Handle the case where checkEmailExists returns null (error).
		if (isEmailExists === null) {
			return message(
				authEmailForm,
				{
					status: 'error',
					text: AUTH_MESSAGES.SERVER_ERROR
				},
				{ status: 500 }
			);
		}

		if (formType === 'signUp' && isEmailExists) {
			return setError(authEmailForm, 'email', 'E-mail already exists');
		}

		// Attempt to sign in or sign up with the given email.
		const { error: authError } = await supabase.auth.signInWithOtp({
			email: authEmailForm.data.email,
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});

		if (authError) {
			console.error(authError);

			return message(
				authEmailForm,
				{ status: 'error', text: AUTH_MESSAGES.SERVER_ERROR },
				{ status: 500 }
			);
		}

		return message(authEmailForm, {
			status: 'success',
			text: formType === 'signIn' ? AUTH_MESSAGES.SUCCESSFUL_LOGIN : AUTH_MESSAGES.SUCCESSFUL_SIGNUP
		});
	},

	oauth: async ({ request, url, locals: { supabase } }) => {
		const oauthForm = await superValidate<typeof OAuthProviderSchema, FormStatusMessage>(
			request,
			OAuthProviderSchema
		);

		if (!oauthForm.valid) {
			return message(
				oauthForm,
				{ status: 'error', text: AUTH_MESSAGES.UNSUPPORTED_OAUTH_PROVIDER },
				{ status: 400 }
			);
		}

		const provider = oauthForm.data.provider.toLowerCase() as Provider;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${url.origin}/auth/callback` }
		});

		if (error) {
			console.error(error);
			return message(
				oauthForm,
				{ status: 'error', text: AUTH_MESSAGES.SERVER_ERROR },
				{ status: 500 }
			);
		}

		throw redirect(303, data.url);
	}
};
