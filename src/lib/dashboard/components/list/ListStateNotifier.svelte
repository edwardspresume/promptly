<script lang="ts">
	export let stateMessage: string;
</script>

<section
	role="status"
	aria-live="polite"
	aria-atomic="true"
	class="p-2 px-3 mx-auto my-6 text-center border rounded-md shadow-md bg-secondary"
>
	<h3 class="text-xl">
		{stateMessage}
	</h3>
</section>
