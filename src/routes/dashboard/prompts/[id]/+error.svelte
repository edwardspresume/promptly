<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="text-6xl">Error {$page.status}</h1>
<p class="mt-5 text-2xl">{$page.error?.message || 'An unexpected error occurred'}</p>
