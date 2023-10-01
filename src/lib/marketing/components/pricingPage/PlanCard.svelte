<script lang="ts">
	import { page } from '$app/stores';

	import { PlanType, RoutePaths, type PlanFeature } from '$globalTypes';

	import Button from '$globalComponents/ui/button/button.svelte';
	import PlanBenefits from './PlanBenefits.svelte';

	export let features: PlanFeature[];
	export let planType: PlanType;

	const proPlan = $page.data.subscriptionPlans[0];
</script>

<div class="flex flex-col gap-4">
	<article
		class="p-4 border rounded-md shadow-md flex flex-col justify-between h-full gap-9 {planType ===
		PlanType.PRO
			? 'border-primary border-2'
			: ''}"
	>
		<div class="grid gap-7">
			<header class="grid gap-2">
				<h2 class="text-2xl font-bold capitalize">{planType.toLowerCase()}</h2>

				<p class="text-xl">
					<span class="font-bold">${planType === PlanType.PRO ? proPlan.amount : '0'}</span>
					<span class="text-muted-foreground">/month</span>
				</p>
			</header>

			<PlanBenefits {features} {planType} />
		</div>

		<Button
			variant={planType === PlanType.PRO ? 'default' : 'outline'}
			href={planType === PlanType.PRO ? RoutePaths.SIGNUP : RoutePaths.DASHBOARD_PROMPTS}
		>
			{planType === PlanType.PRO ? 'Start Free Trial' : 'Start Now'}
		</Button>
	</article>

	<p class="text-sm text-muted-foreground">
		{#if planType === PlanType.FREE}
			No credit card or login needed
		{:else}
			No credit card needed for the free trial. Cancel your subscription at any time
		{/if}
	</p>
</div>
