<script lang="ts">
	import type { PageData } from './$types';

	import { RoutePaths } from '$globalTypes';

	import SharedPromptForm from '$dashboardComponents/forms/SharedPromptForm.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let data: PageData;

	let { session, sharedPrompt, sharedPromptForm } = data;

	$: ({ session, sharedPrompt, sharedPromptForm } = data);

	$: isLoggedIn = session?.user;
</script>

<svelte:head>
	<title>Promptly | Shared Prompt</title>
	<meta name="description" content="Shared Prompt Details" />
</svelte:head>

<main class="grid h-full py-4 place-items-center">
	<article
		aria-label="Shared Prompt Details"
		class="w-[96%] max-w-xl bg-background border p-6 rounded-lg shadow-sm"
	>
		<header>
			<h3 class="text-lg font-semibold leading-none">Shared Prompt</h3>
			<p class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
				<span>Creator: {sharedPrompt.profile.username ?? 'Anonymous'}</span>
				{#if sharedPrompt.profile.avatarUrl}
					<img
						src={sharedPrompt.profile.avatarUrl}
						alt="Prompt creator avatar"
						class="rounded-full w-7 h-7"
					/>
				{/if}
			</p>
		</header>

		<SharedPromptForm
			{sharedPrompt}
			{sharedPromptForm}
			toastNotificationTarget="dashboardLayout"
			taintedMessage="Do you want to leave this page? Changes you made may not be saved"
		/>
	</article>

	{#if !isLoggedIn}
		<p class="self-start italic font-medium text-center text-accent-foreground">
			<Button variant="link" href={RoutePaths.AUTH} class="p-0">Sign in</Button> to save this prompt
			to your account
		</p>
	{/if}
</main>
