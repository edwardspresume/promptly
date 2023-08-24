import { RoutePaths, type NavigationLink } from '$globalTypes';

export const marketingLinks: NavigationLink[] = [
	{
		title: 'Dashboard',
		href: RoutePaths.DASHBOARD_PROMPTS
	},
	{
		title: 'Sign In',
		href: RoutePaths.AUTH
	},
	{
		title: 'Sign Up',
		href: `${RoutePaths.AUTH}?signup=true`
	}
];
