<script lang="ts">
	import Icon from '$globalComponents/Icon.svelte';

	export let stateMessage: string;
</script>

<section
	role="status"
	aria-live="polite"
	aria-atomic="true"
	class="p-2 mx-auto mt-6 text-center border rounded-md shadow-lg bg-secondary"
>
	<h3 class="flex items-center gap-3 text-xl">
		<Icon name="info" />

		<span>
			{stateMessage}
		</span>
	</h3>
</section>
