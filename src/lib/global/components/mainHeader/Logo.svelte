<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { cn } from '$globalUtils';

	import src from '$assets/logo.png';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;
	export let href: string;
	export let linkTitle: string;
	export { className as class };
</script>

<Button
	variant="link"
	{href}
	title={linkTitle}
	aria-label={linkTitle}
	class={cn('gap-1 px-2 text-2xl font-bold text-secondary-foreground', className)}
>
	<img {src} alt="Promptly logo" title="Promptly" width="33" height="50" />

	<span>Promptly</span>
</Button>
