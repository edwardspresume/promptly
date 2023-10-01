<script lang="ts">
	import type { PlanFeature, PlanType } from '$globalTypes';

	export let features: PlanFeature[];

	export let planType: PlanType;

	const filteredFeatures = features.filter((feature) => feature.availability === planType);
</script>

<ul class="grid gap-3">
	{#each filteredFeatures as { description } (description)}
		<li class="grid grid-cols-[auto,1fr] gap-3">
			<span role="img" aria-label={planType} class="check_mark"></span>
			<span>{description}</span>
		</li>
	{/each}
</ul>
