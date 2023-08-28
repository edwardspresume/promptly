<script lang="ts">
	import { removeLastToast } from '$dashboardUtils/toastUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let dialogElement: HTMLDialogElement;

	function handleCloseModal() {
		removeLastToast();
		dialogElement.close();
	}
</script>

<Button
	size="icon"
	type="button"
	variant="ghost"
	title="Close modal"
	aria-label="Close modal"
	class="hover:text-red-700"
	on:click={handleCloseModal}
>
	<Icon name="close" size={24} />
	<span class="sr-only">Close</span>
</Button>
