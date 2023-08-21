<script lang="ts">
	import InputField from '$globalComponents/Form/InputField.svelte';
	import SubmitButton from '$globalComponents/Form/SubmitButton.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	// export let authFormData;
	export let formType: 'signIn' | 'signUp';

	let buttonTitle = formType === 'signIn' ? 'Sign in' : 'Sign up';

	let heading = formType === 'signIn' ? 'Welcome back' : 'Get Started Today';

	let subHeading =
		formType === 'signIn'
			? 'Sign in to your account'
			: 'Create an account and unlock our exclusive features';
</script>

<section class="p-4 border rounded-md">
	<h2 class="text-2xl">{heading}</h2>
	<p class="mt-1 mb-10 text-sm text-muted-foreground">{subHeading}</p>

	<form method="Post" aria-label="{buttonTitle} using email" class="grid gap-5">
		<InputField
			label="Email"
			type="email"
			name="email"
			autocomplete="email"
			placeholder="you@example.com"
			errorMessage={[]}
		/>

		<SubmitButton title="{buttonTitle} with email" />
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
				class="flex items-center justify-center w-full gap-2 font-bold"
			>
				<Icon name="google" />
				<span>Continue with Google</span>
			</Button>
		</fieldset>
	</form>
</section>
