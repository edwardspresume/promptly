<script>
    import { page } from '$app/stores';
</script>

<ul class="flex gap-3">
    <li>
        <a
            href="/"
            aria-label="Go to Prompts Page"
            aria-current={$page.url.pathname === '/' ? 'page' : undefined}
            class="transition-colors duration-200 hover:text-violet-600 dark:hover:text-violet-400"
            >Prompts</a
        >
    </li>
    <li>
        <a
            href="/tags"
            aria-label="Go to Tags Page"
            aria-current={$page.url.pathname === '/tags' ? 'page' : undefined}
            class="transition-colors duration-200 hover:text-violet-600 dark:hover:text-violet-400"
            >Tags</a
        >
    </li>
</ul>

<style>
    [aria-current='page'] {
        color: rgb(110, 27, 255);
    }

    :global(.dark) [aria-current='page'] {
        color: rgb(156, 104, 247);
    }
</style>
