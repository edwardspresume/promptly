<script lang="ts">
    import type { PageData } from './$types';

    import TabGroup from '$components/Prompts/TabGroup.svelte';

    export let data: PageData;

    let selectedTabIndex: number = 0;
</script>

<svelte:head>
    <title>Promptly</title>
    <meta name="description" content="Promptly Dashboard" />
</svelte:head>

<TabGroup
    on:tabItemClicked={({ detail }) => (selectedTabIndex = detail.activeTabIndex)}
/>
