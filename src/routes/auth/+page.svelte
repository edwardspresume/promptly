<script lang="ts">
	import { page } from '$app/stores';

	import { RoutePaths } from '$globalTypes';

	import AuthForm from '$authComponents/AuthForm.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import * as Tabs from '$globalComponents/ui/tabs';

	const initialTabValue = $page.url.searchParams.get('signup') === 'true' ? 'signUp' : 'signIn';
</script>

<svelte:head>
	<title>Sign In or Sign Up - Manage Your AI Prompts with Promptly</title>

	<meta
		name="description"
		content="Join Promptly to save, find, and manage your AI prompts in one central location. Sign in or sign up now to get started."
	/>
</svelte:head>

<main class="grid grid-cols-1 lg:grid-cols-[minmax(0,44rem),1fr] min-h-[100dvh] items-center">
	<section class="grid w-full max-w-xl gap-12 p-2 mx-auto justify-items-center lg:p-4">
		<Logo href={RoutePaths.MARKETING_LANDING} linkTitle="Return to homepage" class="text-3xl" />

		<Tabs.Root value={initialTabValue} class="w-full">
			<Tabs.List class="grid w-full grid-cols-2 mb-4">
				<Tabs.Trigger value="signIn">Sign in</Tabs.Trigger>
				<Tabs.Trigger value="signUp">Sign up</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="signIn">
				<AuthForm formType="signIn" />
			</Tabs.Content>

			<Tabs.Content value="signUp">
				<AuthForm formType="signUp" />
			</Tabs.Content>
		</Tabs.Root>

		<Button
			href={RoutePaths.MARKETING_LANDING}
			variant="link"
			class="flex items-center gap-2 text-lg"
		>
			<Icon name="home" />

			<span>Return to homepage</span>
		</Button>
	</section>

	<figure
		class="hidden min-h-full bg-center bg-cover border-l border-gray-700 lg:block"
		style="background-image: url('/test.png');"
	/>
</main>
