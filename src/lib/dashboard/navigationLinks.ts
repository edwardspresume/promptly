import { RoutePaths, type NavigationLink } from '$globalTypes';

export const dashboardLinks: NavigationLink[] = [
	{
		title: 'Prompts',
		href: RoutePaths.DASHBOARD_PROMPTS
	},
	{
		title: 'Tags',
		href: '/dashboard/tags'
	}
];
