<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import AuthForm from '$authComponents/AuthForm.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import * as Tabs from '$globalComponents/ui/tabs';

	export let data: PageData;

	const emailFormData = data.authEmailForm;
	const oAuthFormData = data.oAuthForm;

	const initialTabValue = $page.url.searchParams.get('signup') === 'true' ? 'signUp' : 'signIn';
</script>

<svelte:head>
	<title>Sign In or Sign Up - Manage Your AI Prompts with Promptly</title>

	<meta
		name="description"
		content="Join Promptly to save, manage, and test your AI prompts in one central location. Sign in or sign up now to get started."
	/>
</svelte:head>

<main class="grid grid-cols-1 lg:grid-cols-[minmax(0,44rem),1fr] min-h-[100dvh] items-center">
	<section class="w-full max-w-xl p-4 mx-auto lg:p-4">
		<Tabs.Root value={initialTabValue}>
			<Tabs.List class="grid w-full grid-cols-2 mb-4">
				<Tabs.Trigger value="signIn">Sign in</Tabs.Trigger>
				<Tabs.Trigger value="signUp">Sign up</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="signIn">
				<AuthForm {emailFormData} {oAuthFormData} formType="signIn" />
			</Tabs.Content>

			<Tabs.Content value="signUp">
				<AuthForm {emailFormData} {oAuthFormData} formType="signUp" />
			</Tabs.Content>
		</Tabs.Root>

		<Button href="/" variant="link" class="flex items-center gap-2 mx-auto mt-10 text-lg w-fit">
			<Icon name="home" />

			<span>Return to homepage</span>
		</Button>
	</section>

	<figure
		class="hidden min-h-full bg-center bg-cover border-l border-gray-700 lg:block"
		style="background-image: url('/test.png');"
	/>
</main>
