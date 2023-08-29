import { removeLastToast } from './toastUtils';

/**
 * Generates a new date string in ISO format.
 * @returns {string} The current date and time in ISO format.
 */
export const createDate = () => new Date().toISOString();

/**
 * Closes the dialog if a click is detected outside the dialog area
 * @param {MouseEvent} event - Mouse event
 * @param {HTMLDialogElement} dialog - Dialog element
 */
export function closeDialogOnOutsideClick(event: MouseEvent, dialog: HTMLDialogElement) {
	const { left, right, top, bottom } = dialog.getBoundingClientRect();

	const isOutsideClick =
		event.clientX <= left ||
		event.clientX >= right ||
		event.clientY <= top ||
		event.clientY >= bottom;

	if (isOutsideClick) {
		dialog.close();
		removeLastToast();
	}
}
