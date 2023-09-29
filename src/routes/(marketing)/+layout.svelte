<script>
	import PageLoadingSpinner from '$globalComponents/general/PageLoadingSpinner.svelte';
	import MarketingHeader from '$marketingComponents/marketingHeader/MarketingHeader.svelte';
</script>

<div class="h-[100dvh] flex flex-col">
	<MarketingHeader />

	<PageLoadingSpinner>
		<main class="flex-1">
			<slot />
		</main>

		<footer>
			<div class="container py-2">
				<p class="text-muted-foreground">&copy; Promptly</p>
			</div>
		</footer>
	</PageLoadingSpinner>
</div>
