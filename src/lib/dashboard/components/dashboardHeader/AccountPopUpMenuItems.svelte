<script>
	import Icon from '$globalComponents/Icon.svelte';
	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import LoginLogoutBtn from './LoginLogoutBtn.svelte';
</script>

<li>
	<Button variant="ghost" href="#plans" title="Upgrade to Pro" aria-label="Upgrade to Pro">
		<Icon name="crown" />

		<span>
			Upgrade to <span
				class="py-1 text-white rounded-md pe-2 ps-2 bg-gradient-to-r from-sky-500 to-indigo-500"
			>
				Pro
			</span>
		</span>
	</Button>
</li>

<li>
	<Button variant="ghost" title="Feedback" aria-label="Feedback">
		<Icon name="feedback" />
		<span>Feedback</span>
	</Button>
</li>

<li>
	<ThemeToggleBtn hideText={false} />
</li>

<li>
	<LoginLogoutBtn />
</li>

<style lang="postcss">
	li {
		@apply hover:bg-accent rounded-md;

		:global(a),
		:global(button) {
			@apply flex items-center justify-start w-full h-full gap-2 p-2 text-base;
		}
	}
</style>
