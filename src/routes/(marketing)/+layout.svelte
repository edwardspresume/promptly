<script>
	import PageLoadingSpinner from '$globalComponents/general/PageLoadingSpinner.svelte';
	import MarketingHeader from '$marketingComponents/marketingHeader/MarketingHeader.svelte';
</script>

<div class="h-[100dvh] flex flex-col">
	<MarketingHeader />

	<PageLoadingSpinner>
		<main
			class="grid flex-1 px-3 bg-center bg-cover place-items-center bg-blend-darken bg-[rgb(0,0,0,0.9)]"
			style="background-image: url(hero-3.webp)"
		>
			<slot />
		</main>
	</PageLoadingSpinner>
</div>
