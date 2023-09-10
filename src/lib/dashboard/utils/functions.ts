import { logError } from '$globalUtils';
import { notifyError, notifySuccess, removeLastToast } from './toastUtils';

/**
 * Generates a new date string in ISO format.
 * @returns {string} The current date and time in ISO format.
 */
export const createDate = () => new Date().toISOString();

/**
 * Calls the provided callback function when the Enter or Space key is pressed.
 * @param event - The KeyboardEvent object
 * @param callback - The function to call when the Enter or Space key is pressed
 */
export function handleKeyDown(event: KeyboardEvent, callback: () => void) {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault(); // Prevent default behavior of Enter key
		callback();
	}
}

/**
 * Closes the dialog if a click is detected outside the dialog area, except when the click
 * is on an element with the '_toastBtn' class.
 *
 * @param {MouseEvent} event - The mouse event triggered by the click
 * @param {HTMLDialogElement} dialog - The dialog element to be closed
 */
export function closeDialogOnOutsideClick(event: MouseEvent, dialog: HTMLDialogElement) {
	// Get the bounding client rect of the dialog to determine the area of the dialog
	const { left, right, top, bottom } = dialog.getBoundingClientRect();

	// Determine whether the click was outside the dialog area
	const isOutsideClick =
		event.clientX <= left ||
		event.clientX >= right ||
		event.clientY <= top ||
		event.clientY >= bottom;

	// Determine whether the clicked element has the '_toastBtn' class
	const isToastBtn = (event.target as HTMLElement).classList.contains('_toastBtn');

	// If the click is outside the dialog and not on a '_toastBtn', close the dialog
	if (isOutsideClick && !isToastBtn) {
		dialog.close();
		removeLastToast();
	}
}

/**
 * Attach a 'click' event listener to the document that triggers when a click occurs outside the specified targetNode.
 * @param targetNode The DOM node for outside click detection.
 * @param callback Callback function to execute when a click occurs outside of the targetNode.
 * @returns An object with a 'destroy' method for removing the 'click' event listener.
 */
export function onOutsideClick(targetNode: Node, callback: () => void) {
	/**
	 * Event listener callback that triggers when a 'click' event occurs on the document.
	 * @param event The click event.
	 */
	function handleClick(event: MouseEvent) {
		// Trigger the provided callback function if the 'click' event occurred outside the targetNode.
		if (targetNode && !targetNode.contains(event.target as Node)) callback();
	}

	document.addEventListener('click', handleClick);

	// Return an object with a 'destroy' method that can be used to remove the 'click' event listener from the document.
	return {
		destroy() {
			document.removeEventListener('click', handleClick);
		}
	};
}

/**
 * Asynchronously copies a specified text to the user's clipboard and handles notifications for success and error outcomes.
 *
 * @param {string} textToCopy - The text that should be copied to the clipboard.
 * @param {string} successMessage - The message to be displayed on successful copy operation.
 * @param {string} errorMessage - The message to be displayed if the copy operation fails.
 * @param {string} notificationTarget - The target element where the notification should be displayed.
 *
 * @throws Will throw an error if `textToCopy` is not provided.
 */
export async function copyToClipboard(
	textToCopy: string,
	successMessage: string,
	errorMessage: string,
	notificationTarget: string
) {
	try {
		if (!textToCopy) {
			throw new Error('No text provided to copy');
		}

		await navigator.clipboard.writeText(textToCopy);

		notifySuccess(successMessage, { target: notificationTarget });
	} catch (error) {
		logError(error, 'Failed to copy text to clipboard');

		notifyError(errorMessage, { target: notificationTarget });
	}
}

/**
 * Sends a request to delete a specific item or all items, based on the provided URL path and optional itemId.
 * @param {string} urlPath - URL path for the delete request.
 * @param {string | null} [itemId] - Optional item ID for deleting a specific item.
 * @returns {Promise<any>} - JSON response from the server.
 */
export async function deleteItemFromDatabaseRequest(urlPath: string, itemId?: string | null) {
	try {
		const formData = new URLSearchParams();

		if (itemId) {
			formData.append('itemId', itemId);
		}

		const response = await fetch(urlPath, {
			method: 'POST',
			body: formData.toString(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			}
		});

		return response.json();
	} catch (error) {
		console.error(`Error deleting item`);
	}
}
