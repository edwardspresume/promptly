<script lang="ts">
	import { page } from '$app/stores';

	import { RoutePaths } from '$globalTypes';

	import AuthForm from '$authComponents/AuthForm.svelte';
	import Icon from '$globalComponents/Icon.svelte';
	import MetaTags from '$globalComponents/MetaTags.svelte';
	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import * as Tabs from '$globalComponents/ui/tabs';

	const initialTabValue = $page.url.searchParams.get('signup') === 'true' ? 'signUp' : 'signIn';
</script>

<MetaTags
	title="Access Your Prompt Library: Sign In or Sign Up | Promptly"
	description="Unlock a centralized hub for managing your AI prompts. Whether you're returning or new, sign in or sign up to start your 7-day free trial with Promptly."
/>

<main class="grid grid-cols-1 lg:grid-cols-[minmax(0,44rem),1fr] min-h-[100dvh] items-center">
	<section class="grid w-full max-w-xl gap-12 p-2 mx-auto justify-items-center lg:p-4">
		<Logo />

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

	<aside
		class="hidden min-h-screen bg-center bg-cover border-l border-gray-700 lg:grid place-content-center bg-blend-darken bg-black/70"
		style="background-image: url('books.webp');"
	>
		<div class="p-2 px-3 rounded-lg bg-black/80">
			<p class="text-3xl">Your Prompt Library Awaits</p>
		</div>
	</aside>
</main>

<style lang="postcss">
	aside p {
		letter-spacing: 2px;
		background: linear-gradient(to right, #7a30f0, #a57de4);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-family: 'croissantone', cursive;
	}
</style>
