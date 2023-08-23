<script lang="ts">
	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let title: string = 'Submit';
	export let extraStyles: string = '';
	export let disabled: boolean = false;
	export let size: 'default' | 'sm' | 'lg' | 'icon' = 'lg';
</script>

<Button
	{size}
	{disabled}
	type="submit"
	aria-label={title}
	aria-disabled={disabled}
	class="font-bold flex gap-2 items-center {extraStyles}"
>
	{#if disabled}
		<Icon name="loading-spinner" animateSpin={true} />
	{/if}

	<span>
		{title}
	</span>
</Button>
