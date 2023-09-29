<script lang="ts">
	import { PlanType, type PlanFeature } from '$globalTypes';

	export let features: PlanFeature[];

	export let planType: PlanType;
</script>

<ul class="grid gap-3 my-7">
	{#each features as { description } (description)}
		<li class="grid grid-cols-[auto,1fr] gap-3">
			<span
				role="img"
				aria-label={planType}
				class={planType === PlanType.PRO ? 'check_mark' : 'error_mark'}
			></span>
			<span>{description}</span>
		</li>
	{/each}
</ul>
