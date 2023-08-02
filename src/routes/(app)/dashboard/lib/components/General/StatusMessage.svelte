<script lang="ts">
    export let message: string;
</script>

<aside
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="mx-auto mt-6 text-xl text-center rounded-md theme w-fit"
>
    <h3>
        {message}
    </h3>
</aside>
