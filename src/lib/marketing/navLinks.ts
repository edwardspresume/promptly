import { RoutePaths, type NavLink } from '$globalTypes';

export const marketingNavLinks: NavLink[] = [
	{
		title: 'Dashboard',
		href: RoutePaths.DASHBOARD_PROMPTS,
		ariaLabel: 'Go to the dashboard'
	},
	{
		title: 'Sign In',
		href: RoutePaths.AUTH,
		ariaLabel: 'Go to the sign in page'
	},
	{
		title: 'Sign Up',
		href: `${RoutePaths.AUTH}?signup=true`,
		ariaLabel: 'Go to the sign up page'
	}
];
