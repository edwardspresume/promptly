<script lang="ts">
	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import { RoutePaths } from '$globalTypes';

	import Icon from '$globalComponents/Icon.svelte';

	let href: string;

	if (!$userProfileStore) href = RoutePaths.MARKETING_PRICING;
	else href = RoutePaths.DASHBOARD_BILLING;
</script>

<a {href} title="Upgrade to Pro" aria-label="Upgrade to Pro">
	<Icon name="crown" />

	<span>
		Upgrade to <span
			class="py-1 text-white rounded-md pe-2 ps-2 bg-gradient-to-r from-sky-500 to-indigo-500"
		>
			Pro
		</span>
	</span>
</a>
