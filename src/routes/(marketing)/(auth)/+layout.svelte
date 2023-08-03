<script lang="ts">
    import type { LayoutData } from './$types';

    import '$globalStyles';

    export let data: LayoutData;
</script>

<div
    class="grid grid-cols-1 lg:grid-cols-[minmax(0,40rem),1fr] min-h-[100dvh] items-center transition-colors duration-200 bg-primary text-primary"
>
    <main class="w-full max-w-xl p-4 mx-auto lg:p-16">
        <slot />
    </main>

    <aside
        class="hidden min-h-full bg-center bg-cover border-l border-gray-700 lg:block"
        style="background-image: url('/test.png');"
    />
</div>
