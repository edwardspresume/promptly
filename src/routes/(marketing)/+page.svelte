<script>
	import DashboardLink from '$marketingComponents/DashboardLink.svelte';
</script>

<svelte:head>
	<title>Save, find, share, and Manage Your AI Prompts with Promptly</title>

	<meta
		name="description"
		content="Welcome to Promptly, the central place to save, find, share, and manage your AI prompts. Discover our powerful tools and features to improve your AI prompting process"
	/>
</svelte:head>

<section class="text-center">
	<h1 class="text-4xl md:text-8xl">
		Prompt <span class="text-primary">AI</span>
		<br />

		<span>
			The <span class="underline text-primary">Simple</span> Way
		</span>
	</h1>

	<p class="mt-6 mb-12 text-lg text-muted-foreground">
		Central place to save, find, share, and manage your prompts.
	</p>

	<DashboardLink text="Try it out" class="text-xl" />
</section>
