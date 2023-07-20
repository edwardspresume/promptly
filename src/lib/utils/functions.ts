/**
 * Attach a 'click' event listener to the document that triggers when a click occurs outside the specified targetNode.
 * @param targetNode The DOM node for outside click detection.
 * @param callback Callback function to execute when a click occurs outside of the targetNode.
 * @returns An object with a 'destroy' method for removing the 'click' event listener.
 */
export function onOutsideClick(targetNode: Node, callback: () => void) {
    /**
     * Event listener callback that triggers when a 'click' event occurs on the document.
     * @param {MouseEvent} event The click event.
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
