import { RoutePaths, type NavLink } from '$globalTypes';

export const dashboardNavLinks: NavLink[] = [
	{
		title: 'Prompts',
		href: RoutePaths.DASHBOARD_PROMPTS,
		ariaLabel: 'Go to the prompts page'
	},
	{
		title: 'Tags',
		href: '/dashboard/tags',
		ariaLabel: 'Go to the tags page'
	}
];
