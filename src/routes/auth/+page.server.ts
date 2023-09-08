import type { Provider } from '@supabase/supabase-js';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { RoutePaths, type AlertMessage } from '$globalTypes';

import {
	EmailAuthValidationSchema,
	OAuthProviderValidationSchema
} from '$authValidationSchemas/authValidationSchemas';

import { checkEmailExists, sanitizeContent } from '$databaseDir/utils.server';

const AUTH_MESSAGES = {
	INVALID_EMAIL: 'The email you entered is invalid. Please enter a valid email address.',

	SERVER_ERROR: 'An error occurred on the server. Please try again later.',

	UNSUPPORTED_OAUTH_PROVIDER:
		'The selected sign-in provider is currently not supported. Please choose a different provider.',

	SUCCESSFUL_LOGIN: `A sign-in link has been sent to your email. If you don't see it within a few minutes, please check your spam folder.`,

	SUCCESSFUL_SIGNUP: `You have successfully signed up! Please check your email for a confirmation link. If you don't receive it within a few minutes, check your spam folder.`
};

export const load: PageServerLoad = async ({ request, parent }) => {
	const { session } = await parent();

	if (session) {
		throw redirect(303, RoutePaths.DASHBOARD_PROMPTS);
	}

	const authEmailForm = superValidate(request, EmailAuthValidationSchema);
	const oAuthForm = superValidate(request, OAuthProviderValidationSchema);

	return { authEmailForm, oAuthForm };
};

export const actions: Actions = {
	emailAuth: async ({ request, url, locals: { supabase } }) => {
		const authEmailForm = await superValidate<typeof EmailAuthValidationSchema, AlertMessage>(
			request,
			EmailAuthValidationSchema
		);

		if (!authEmailForm.valid) {
			return message(authEmailForm, {
				alertType: 'error',
				alertText: AUTH_MESSAGES.INVALID_EMAIL
			});
		}

		const formType = authEmailForm.data.formType;
		const sanitizedEmail = sanitizeContent(authEmailForm.data.email);

		try {
			// Check if the email already exists when signing up.
			const isEmailExists = await checkEmailExists(sanitizedEmail);

			if (formType === 'signUp' && isEmailExists) {
				return setError(authEmailForm, 'email', 'E-mail already exists');
			}
		} catch (error) {
			return message(
				authEmailForm,
				{
					alertType: 'error',
					alertText: 'An error occurred while verifying your email. Please try again.'
				},
				{ status: 500 }
			);
		}

		// Attempt to sign in or sign up with the given email.
		const { error: emailAuthError } = await supabase.auth.signInWithOtp({
			email: sanitizedEmail,
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});

		if (emailAuthError) {
			console.error(emailAuthError);

			return message(
				authEmailForm,
				{ alertType: 'error', alertText: AUTH_MESSAGES.SERVER_ERROR },
				{ status: 500 }
			);
		}

		return message(authEmailForm, {
			alertType: 'success',
			alertText:
				formType === 'signIn' ? AUTH_MESSAGES.SUCCESSFUL_LOGIN : AUTH_MESSAGES.SUCCESSFUL_SIGNUP
		});
	},

	oauth: async ({ request, url, locals: { supabase } }) => {
		const oauthForm = await superValidate<typeof OAuthProviderValidationSchema, AlertMessage>(
			request,
			OAuthProviderValidationSchema
		);

		if (!oauthForm.valid) {
			return message(oauthForm, {
				alertType: 'error',
				alertText: AUTH_MESSAGES.UNSUPPORTED_OAUTH_PROVIDER
			});
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
				{ alertType: 'error', alertText: AUTH_MESSAGES.SERVER_ERROR },
				{ status: 500 }
			);
		}

		throw redirect(303, data.url);
	}
};
