<script lang="ts">
	import { handleKeyDown } from '$dashboardUtils/functions';

	export let title: string;
	export let onItemClickOrKeyPress: () => void;
</script>

<div
	{title}
	tabindex="0"
	role="button"
	aria-label={title}
	on:click={onItemClickOrKeyPress}
	on:keydown={(event) => handleKeyDown(event, onItemClickOrKeyPress)}
	class="flex items-center justify-between gap-4 p-2 transition-colors duration-300 border rounded-md cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
>
	<slot />
</div>
