<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { RoutePaths } from '$globalTypes';
	import { cn } from '$globalUtils';

	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;
	export { className as class };
</script>

<Button
	variant="link"
	title="Return to homepage"
	aria-label="Return to homepage"
	href={RoutePaths.MARKETING_LANDING}
	class={cn('text-3xl font-bold logo p-0', className)}
>
	Promptly
</Button>

<style>
	@font-face {
		font-family: 'croissantone';
		font-weight: 400;
		src:
			url('/fonts/merienda-variablefont_wght-webfont.woff2') format('woff2'),
			url('/fonts/merienda-variablefont_wght-webfont.woff') format('woff');
	}

	:global(.logo) {
		letter-spacing: 2px;
		font-family: 'croissantone', cursive;
		background: linear-gradient(to right, #7a30f0, #a57de4);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
