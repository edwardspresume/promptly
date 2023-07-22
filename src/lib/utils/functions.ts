import { removeLastToast } from './toast';

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
    if (event.key === 'Enter' || event.key === ' ') callback();
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
        if (targetNode && !targetNode.contains(event.target as Node))
            callback();
    }

    document.addEventListener('click', handleClick);

    // Return an object with a 'destroy' method that can be used to remove the 'click' event listener from the document.
    return {
        destroy() {
            document.removeEventListener('click', handleClick);
        },
    };
}

/**
 * Closes the dialog if a click is detected outside the dialog area
 * @param {MouseEvent} event - Mouse event
 * @param {HTMLDialogElement} dialog - Dialog element
 */
export function closeDialogOnOutsideClick(
    event: MouseEvent,
    dialog: HTMLDialogElement
) {
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
