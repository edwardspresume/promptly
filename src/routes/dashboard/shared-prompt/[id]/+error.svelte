<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="grid h-full text-center place-content-center">
	<h1 class="text-5xl">{$page.error?.message || 'An unexpected error occurred'}</h1>
</main>
