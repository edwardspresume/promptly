/**
 * Adds an event listener to the document that gets triggered when a click occurs outside the specified node.
 * @param {Node} targetNode The node for outside click detection.
 * @param {() => void} outsideClickCallback The callback function to execute when a click occurs outside of the targetNode.
 * @returns {object} An object with a destroy method for removing the event listener.
 */
export function onOutsideClick(node: Node, outsideClickCallback: () => void) {
    /**
     * Handles click events on the document.
     * @param {MouseEvent} event The click event.
     */
    function handleClick(event: MouseEvent) {
        // Check if the click occurred outside of the node
        if (node && !node.contains(event.target as Node))
            outsideClickCallback();
    }

    document.addEventListener('click', handleClick);

    // Return an object with a destroy method that can be used to remove the event listener
    return {
        destroy() {
            document.removeEventListener('click', handleClick);
        },
    };
}
