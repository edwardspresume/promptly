import { RoutePaths, createNavLink, type NavLink } from '$globalTypes';

type DashboardLinks = {
	mainNav: NavLink[];
	accountNav: NavLink[];
};

const mainNav: NavLink[] = [
	createNavLink('My Prompts', RoutePaths.DASHBOARD_PROMPTS, 'Go to the prompts page'),
	createNavLink('My Tags', RoutePaths.DASHBOARD_TAGS, 'Go to the tags page'),
	createNavLink(
		'Community Prompts',
		RoutePaths.DASHBOARD_COMMUNITY_PROMPTS,
		'Go to the community prompts page'
	)
];

const accountNav: NavLink[] = [
	createNavLink('Profile', RoutePaths.DASHBOARD_PROFILE, 'Go to the profile page'),
	createNavLink('Billing', RoutePaths.DASHBOARD_BILLING, 'Go to the billing page')
];

export const dashboardLinks: DashboardLinks = {
	mainNav,
	accountNav
};
