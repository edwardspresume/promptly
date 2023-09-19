<script lang="ts">
	import Icon from '$globalComponents/Icon.svelte';

	export let stateMessage: string;
</script>

<section
	role="status"
	aria-live="polite"
	aria-atomic="true"
	class="p-2 px-3 mx-auto my-6 text-center border rounded-md shadow-md bg-secondary"
>
	<h3 class="grid items-center grid-cols-[auto,1fr] gap-3 text-xl">
		<Icon name="info" />

		<span>
			{@html stateMessage}
		</span>
	</h3>
</section>
