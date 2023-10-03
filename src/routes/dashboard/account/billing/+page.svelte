<script lang="ts">
	import type { PageData } from './$types';

	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';

	export let data: PageData;
</script>

<PageSubHeader heading="Billing" subheading="Your billing information" />
