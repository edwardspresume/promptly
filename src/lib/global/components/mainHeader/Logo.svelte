<script lang="ts">
	import src from '$assets/logo.png';

	export let href: string;
	export let linkTitle: string;
</script>

<a {href} title={linkTitle} aria-label={linkTitle} class="flex items-center gap-1">
	<img {src} alt="Promptly logo" title="Promptly" width="33" height="50" />

	<span class="text-2xl font-bold">Promptly</span>
</a>
