<script lang="ts">
    import src from '$assets/logo_3_small.png';

    export let href: string;
    export let title: string;
</script>

<a {href} {title} aria-label={title} class="flex items-center gap-1">
    <img {src} alt="Promptly logo" title="Promptly" width="33" height="50" />

    <span class="text-2xl font-bold">Promptly</span>
</a>
