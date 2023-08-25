<script>
	import MarketingHeader from '$marketingComponents/marketingHeader/MarketingHeader.svelte';
</script>

<div class="h-[100dvh] flex flex-col">
	<MarketingHeader />

	<main class="flex-1">
		<div class="container grid items-center h-full">
			<slot />
		</div>
	</main>

	<footer>
		<div class="container py-2">
			<p class="text-muted-foreground">&copy; Promptly</p>
		</div>
	</footer>
</div>
