<script lang="ts">
	export let text: string = 'Dashboard';
	export let extraStyles: string = '';
</script>

<a
	href="/dashboard/prompts"
	aria-label="Go to the dashboard"
	class="p-1 px-2 transition-all duration-300 rounded bg-primary hover:bg-primary/80 text-primary-foreground {extraStyles}"
	>{text}</a
>
