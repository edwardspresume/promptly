/**
 * Toast notifications utility for app
 * This module provides functions to show success and error toast notifications.
 * @module toastUtils
 */

import { toast } from '@zerodevx/svelte-toast';


// Get the type of the options parameter of the toast.push function.
type ToastOptions = Parameters<typeof toast.push>[1];


/**
 * Creates the HTML content for the toast notification.
 * @param {string} iconClass - The CSS class for the icon to be displayed in the toast.
 * @param {string} message - The message to be displayed in the toast.
 * @returns {string} - The HTML content for the toast.
 */
function createToastContent(iconClass: string, message: string) {
	return `<div class="${iconClass}"></div><span>${message}</span>`;
}

/**
 * Shows a success toast notification.
 * @param {string} message - The message to be displayed in the toast.
 * @param {object} [options={}] - Optional configuration for the toast.
 */
export const notifySuccess = (message: string, options?: ToastOptions) => {
	const content = createToastContent('check_mark', message);
	toast.push(content, options);
};

/**
 * Shows an error toast notification.
 * @param {string} message - The message to be displayed in the toast.
 * @param {object} [options={}] - Optional configuration for the toast.
 */
export const notifyError = (message: string, options?: ToastOptions) => {
	const content = createToastContent('error_mark', message);
	toast.push(content, options);
};

/**
 * Removes the last toast targeted to 'baseModal'.
 */
export const removeLastToast = () => toast.pop({ target: 'baseModal' });
