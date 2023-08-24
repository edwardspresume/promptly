<script>
	import DashboardLink from '$marketingComponents/DashboardLink.svelte';
</script>

<svelte:head>
	<title>Save, Manage, and Test Your AI Prompts with Promptly</title>

	<meta
		name="description"
		content="Welcome to Promptly, the central place to save, manage, and test your AI prompts. Discover our powerful tools and features to improve your AI prompting process"
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
		Central app to save, manage, and test your prompts.
	</p>

	<DashboardLink text="Try it out" extraStyles="text-xl" />
</section>
