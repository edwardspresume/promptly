<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { AuthEmailSchema } from '$authSchemas/AuthEmailSchema';

	import InputField from '$globalComponents/Form/InputField.svelte';
	import SubmitButton from '$globalComponents/Form/SubmitButton.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let authFormData;

	export let formType: 'signIn' | 'signUp';

	let buttonTitle = formType === 'signIn' ? 'Sign in' : 'Sign up';

	let heading = formType === 'signIn' ? 'Welcome back' : 'Get Started Today';

	let subHeading =
		formType === 'signIn'
			? 'Sign in to your account'
			: 'Create an account and unlock our exclusive features';

	const { enhance, form, errors, delayed, message } = superForm(authFormData, {
		id: formType,
		resetForm: true,
		taintedMessage: false,
		validators: AuthEmailSchema
	});
</script>

<section class="p-4 border rounded-md">
	{#if $message}
		<p class="p-3 mb-8 font-bold text-center bg-green-600 rounded-md">
			{$message.text}
		</p>
	{/if}

	<header class="mb-10">
		<h2 class="text-2xl">{heading}</h2>
		<p class="text-sm text-muted-foreground">{subHeading}</p>
	</header>

	<form use:enhance method="Post" aria-label="{buttonTitle} using email" class="grid gap-5">
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

	<div class="flex items-center my-6">
		<div class="flex-grow mr-3 border-t border-gray-500" />
		<div>or</div>
		<div class="flex-grow ml-3 border-t border-gray-500" />
	</div>

	<form method="Post" aria-label="{buttonTitle} using Google">
		<fieldset>
			<Button
				size="lg"
				type="button"
				aria-label="Continue with Google"
				formaction="?/auth&provider=google"
				disabled={$delayed}
				class="flex items-center justify-center w-full gap-2 font-bold"
			>
				<Icon name="google" />
				<span>Continue with Google</span>
			</Button>
		</fieldset>
	</form>
</section>
