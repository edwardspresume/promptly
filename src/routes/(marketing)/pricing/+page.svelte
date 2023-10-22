<script lang="ts">
	import { PlanType, type PlanFeature } from '$globalTypes';

	import MetaTags from '$globalComponents/MetaTags.svelte';
	import PlanCard from '$marketingComponents/pricingPage/PlanCard.svelte';

	const features: PlanFeature[] = [
		{
			description: 'Export data',
			availability: PlanType.FREE
		},
		{
			description: 'Export data',
			availability: PlanType.PRO
		},
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
			description: 'AI suggestions for Prompt and Tag fields',
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

<MetaTags
	title="Promptly Pricing: Tailored Plans for Every Prompt Management Need"
	description="Explore Promptly's flexible pricing options, starting free with essential features, or upgrade to Pro at $5/month for advanced prompt enhancements, unlimited storage, and seamless data sync across devices. Kickstart your journey with a 7-day free trial, no credit card required."
/>

<div class="container">
	<header class="grid gap-4 mt-10 text-center mb-14 xl:mt-0">
		<h1 class="text-4xl text-white">Pricing</h1>

		<h2 class="text-xl text-[#9CA3AF]">
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
