<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';

    import { EmailAuthValidationSchema } from '$authValidationSchemas/authValidationSchemas';

	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import OAuthForm from './OAuthForm.svelte';

	export let formType: 'signIn' | 'signUp';

	const formText = {
		signIn: {
			buttonTitle: 'Sign in',
			heading: 'Welcome back',
			subHeading: 'Sign in to your account'
		},
		signUp: {
			buttonTitle: 'Sign up',
			heading: 'Get Started Today',
			subHeading: 'Create an account and unlock our exclusive features'
		}
	};

	let { buttonTitle, heading, subHeading } = formText[formType];

	const { enhance, form, errors, delayed, message } = superForm($page.data.authEmailForm, {
		id: formType,
		resetForm: true,
		taintedMessage: false,
		validators: EmailAuthValidationSchema
	});
</script>

<section class="p-4 border rounded-md">
	{#if $message}
		<p
			role="alert"
			aria-live="polite"
			title={$message.statusType === 'error' ? 'Error message' : 'Success message'}
			class="p-3 mb-8 font-bold text-center rounded-md {$message.statusType === 'error'
				? 'bg-red-600'
				: 'bg-green-600'}"
		>
			{$message.text}
		</p>
	{/if}

	<header class="mb-10">
		<h2 class="text-2xl">{heading}</h2>
		<p class="text-muted-foreground">{subHeading}</p>
	</header>

	<form
		use:enhance
		action="?/emailAuth"
		method="Post"
		aria-label="{buttonTitle} using email"
		class="grid gap-5"
	>
		<input type="hidden" name="formType" value={formType} />

		<InputField
			bind:value={$form.email}
			label="Email"
			type="email"
			name="email"
			autocomplete="email"
			placeholder="you@example.com"
			errorMessage={$errors.email}
		/>

		<SubmitButton title="{buttonTitle} with email" disabled={$delayed} />
	</form>

	<div class="flex items-center my-4">
		<div class="flex-grow mr-3 border-t border-gray-500" />
		<div>or</div>
		<div class="flex-grow ml-3 border-t border-gray-500" />
	</div>

	<OAuthForm {formType} />
</section>
