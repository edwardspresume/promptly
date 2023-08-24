<script lang="ts">
	import { RoutePaths } from '$globalTypes';

	import Button from '$globalComponents/ui/button/button.svelte';

	export let text: string = 'Dashboard';
	export let extraStyles: string = '';
</script>

<Button href={RoutePaths.DASHBOARD_PROMPTS} aria-label="Go to the dashboard" class={extraStyles}>
	{text}
</Button>
