<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { RoutePaths } from '$globalTypes';
	import { cn } from '$globalUtils';

	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;

	export { className as class };
	export let text: string = 'Dashboard';
</script>

<Button href={RoutePaths.DASHBOARD_PROMPTS} aria-label="Go to the dashboard" class={cn(className)}>
	{text}
</Button>
