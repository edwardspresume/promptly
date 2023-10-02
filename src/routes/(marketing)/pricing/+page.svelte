<script lang="ts">
	import { PlanType, type PlanFeature } from '$globalTypes';

	import PlanCard from '$marketingComponents/pricingPage/PlanCard.svelte';

	const features: PlanFeature[] = [
		{
			description: '5MB of storage space',
			availability: PlanType.FREE
		},

		{
			description: 'Unlimited storage space',
			availability: PlanType.PRO
		},

		{
			description: 'Data sync across multiple devices',
			availability: PlanType.PRO
		},

		{
			description: 'Improve your existing prompts with GPT-4',
			availability: PlanType.PRO
		},

		{
			description: 'Sharing prompts via a private link or publicly',
			availability: PlanType.PRO
		},

		{
			description: 'Save prompts from the community page with a single click',
			availability: PlanType.PRO
		}
	];
</script>

<div class="w-full">
	<header class="grid gap-4 mt-10 text-center mb-14 xl:mt-0">
		<h1 class="text-4xl">Pricing</h1>

		<h2 class="text-xl text-muted-foreground">
			Choose Your Promptly Plan: Free to Start, Easy to Upgrade
		</h2>
	</header>

	<section
		aria-labelledby="plan-section"
		class="grid [grid-template-columns:repeat(auto-fit,minmax(min-content,34rem))] justify-center gap-8 mb-10 sm:mb-0"
	>
		<PlanCard {features} planType={PlanType.FREE} />
		<PlanCard {features} planType={PlanType.PRO} />
	</section>
</div>
