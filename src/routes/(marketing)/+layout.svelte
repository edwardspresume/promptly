<script>
	import { page } from '$app/stores';
	import PageLoadingSpinner from '$globalComponents/general/PageLoadingSpinner.svelte';
	import MarketingHeader from '$marketingComponents/marketingHeader/MarketingHeader.svelte';

	$: isLandingPage = $page.url.pathname === '/';
</script>

<div class="h-[100dvh] flex flex-col">
	<MarketingHeader />

	<PageLoadingSpinner>
		<main class="grid flex-1 px-3 place-items-center">
			<slot />
		</main>
	</PageLoadingSpinner>

	<footer>
		<div class="container py-2">
			<p class="text-muted-foreground">&copy; Promptly</p>
		</div>
	</footer>
</div>

{#if isLandingPage}
	<style>
		main {
			background-image: url('/src/assets/hero.webp');
			background-size: cover;
			background-position: center;
			background-blend-mode: darken;
			background-color: rgba(0, 0, 0, 0.86);
		}
	</style>
{/if}
