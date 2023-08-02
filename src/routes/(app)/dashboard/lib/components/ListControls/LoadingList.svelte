<script>
    // Define the number of loading items to display
    const LOADING_ITEMS_COUNT = 2;
</script>

<p
    aria-busy="true"
    class="border rounded-md border-white/10 bg-white/20 dark:bg-white/5 animate-pulse w-fit"
>
    <span class="invisible">Showing 4 out of 4 tags</span>
</p>

<ul role="list" aria-busy="true" class="mt-3 space-y-5">
    {#each Array(LOADING_ITEMS_COUNT) as _}
        <li
            class="p-4 border rounded-md border-white/10 bg-white/20 dark:bg-white/5 animate-pulse"
        />
    {/each}
</ul>
