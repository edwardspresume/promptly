<script lang="ts">
	import { page } from '$app/stores';

	import { dashboardLinks } from '$dashboardNavLinks';

	import Button from '$globalComponents/ui/button/button.svelte';
</script>

<div class="grid gap-6 p-4 mx-auto mt-10 accountWrapper">
	<header class="pb-6 border-b">
		<h1 class="text-xl">Account</h1>

		<p class="text-muted-foreground">Manage your account</p>
	</header>

	<nav class="pb-6 border-b md:border-0">
		<ul class="flex gap-1 md:flex-col md:gap-2">
			{#each dashboardLinks.accountNav as { title, href, ariaLabel } (title)}
				{@const isCurrentPage = $page.url.pathname === href ? 'page' : undefined}

				<li>
					<Button
						{href}
						variant="link"
						aria-label={ariaLabel}
						aria-current={isCurrentPage}
						class="w-full py-1 text-forground h-fit hover:bg-accent"
					>
						<span>
							{title}
						</span>
					</Button>
				</li>
			{/each}
		</ul>
	</nav>

	<main>
		<slot />
	</main>
</div>

<style lang="postcss">
	div nav :global(a) {
		text-decoration: none;
	}

	div :global(a[aria-current='page']) {
		@apply bg-accent hover:bg-accent/80;
	}

	@media (min-width: 768px) {
		.accountWrapper {
			grid-template-columns: 20% 1fr;

			grid-template-areas:
				'header header'
				'nav main';

			header {
				grid-area: header;
			}

			nav {
				grid-area: nav;
			}

			main {
				grid-area: main;
			}
		}
	}
</style>
