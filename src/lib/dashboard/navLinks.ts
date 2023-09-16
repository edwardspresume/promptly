import { RoutePaths, createNavLink, type NavLink } from '$globalTypes';

type DashboardLinks = {
	mainNav: NavLink[];
	accountNav: NavLink[];
};

const mainNav: NavLink[] = [
	createNavLink('Prompts', RoutePaths.DASHBOARD_PROMPTS, 'Go to the prompts page'),
	createNavLink('Tags', RoutePaths.DASHBOARD_TAGS, 'Go to the tags page')
];

const accountNav: NavLink[] = [
	createNavLink('Profile', RoutePaths.DASHBOARD_PROFILE, 'Go to the profile page'),
	createNavLink('Billing', RoutePaths.DASHBOARD_BILLING, 'Go to the billing page')
];

export const dashboardLinks: DashboardLinks = {
	mainNav,
	accountNav
};
