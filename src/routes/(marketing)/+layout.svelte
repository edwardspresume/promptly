<script>
	import MetaTags from '$globalComponents/MetaTags.svelte';
	import PageLoadingSpinner from '$globalComponents/general/PageLoadingSpinner.svelte';
	import MarketingHeader from '$marketingComponents/marketingHeader/MarketingHeader.svelte';
</script>



<div class="h-[100dvh] flex flex-col">
	<MarketingHeader />

	<PageLoadingSpinner>
		<main class="grid flex-1 px-3 place-items-center">
			<slot />
		</main>
	</PageLoadingSpinner>
</div>

<style>
	main {
		background-image: url('hero.webp');
		background-size: cover;
		background-position: center;
		background-blend-mode: darken;
		background-color: rgba(0, 0, 0, 0.86);
	}
</style>
