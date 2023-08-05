<script lang="ts">
    import { removeLastToast } from '$dashboardUtils/toast';

    import Icon from '$globalComponents/Icon.svelte';

    export let dialogElement: HTMLDialogElement;

    function handleCloseModal() {
        dialogElement.close();
        removeLastToast();
    }
</script>

<button
    type="button"
    title="Close modal"
    aria-label="Close modal"
    class="hover:text-red-700"
    on:click={handleCloseModal}
>
    <Icon name="close" size={26} />
</button>
