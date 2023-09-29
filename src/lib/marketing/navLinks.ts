import { RoutePaths, createNavLink, type NavLink } from '$globalTypes';

export const marketingLinks: NavLink[] = [
	createNavLink('Dashboard', RoutePaths.DASHBOARD_PROMPTS),
	createNavLink('Sign In', RoutePaths.SIGNIN),
	createNavLink('Sign Up', RoutePaths.SIGNUP),
	createNavLink('Pricing', RoutePaths.MARKETING_PRICING)
];
