<script lang="ts">
	export let text: string = 'Dashboard';
	export let extraStyles: string = '';
</script>

<a
	href="/dashboard/prompts"
	aria-label="Go to the dashboard"
	class="p-1 px-2 transition-all duration-200 rounded bg-primary hover:brightness-125 text-primary-foreground {extraStyles}"
	>{text}</a
>
