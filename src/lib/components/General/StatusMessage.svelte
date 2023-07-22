<script lang="ts">
    export let message: string;
</script>

<aside
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="py-1 mx-auto mt-6 text-xl text-center border rounded-md pe-2 border-white/10 bg-white/20 w-fit ps-2"
>
    <h3>
        {message}
    </h3>
</aside>
