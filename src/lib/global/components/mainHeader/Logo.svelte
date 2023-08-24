<script lang="ts">
	import src from '$assets/logo.png';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let href: string;
	export let linkTitle: string;
</script>

<Button
	variant="link"
	{href}
	title={linkTitle}
	aria-label={linkTitle}
	class="gap-1 text-secondary-foreground"
>
	<img {src} alt="Promptly logo" title="Promptly" width="33" height="50" />

	<span class="text-2xl font-bold">Promptly</span>
</Button>
