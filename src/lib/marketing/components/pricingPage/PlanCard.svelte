<script lang="ts">
	import { PlanType, RoutePaths, type PlanFeature } from '$globalTypes';

	import { page } from '$app/stores';
	import Button from '$globalComponents/ui/button/button.svelte';
	import PlanBenefits from './PlanBenefits.svelte';

	export let features: PlanFeature[];
	export let planType: PlanType;

	const proPlan = $page.data.subscriptionPlans[0];
</script>

<div
	class="p-4 border rounded-md shadow-md {planType === PlanType.PRO
		? 'border-primary border-2'
		: ''}"
>
	<header class="grid gap-2">
		<h2 class="text-2xl font-bold capitalize">{planType.toLowerCase()}</h2>
		<p class="text-xl">
			<span class="font-bold">${planType === PlanType.PRO ? proPlan.amount : '0'}</span>
			<span class="text-muted-foreground">/month</span>
		</p>
	</header>

	<PlanBenefits {features} {planType} />

	<Button
		variant={planType === PlanType.PRO ? 'default' : 'outline'}
		href={planType === PlanType.PRO ? RoutePaths.SIGNUP : RoutePaths.DASHBOARD_PROMPTS}
		class="w-full"
	>
		{planType === PlanType.PRO ? 'Start Free Trial' : 'Start Now'}
	</Button>

	<p class="mt-4 text-sm text-muted-foreground">
		{#if planType === PlanType.PRO}
			No credit card needed for the free trial. Cancel your subscription at any time
		{:else}
			No credit card or login needed
		{/if}
	</p>
</div>
