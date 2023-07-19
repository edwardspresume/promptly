export function listenForOutsideClick(node: Node, callback: () => void) {
    function handleClick(event: MouseEvent) {
        if (node && !node.contains(event.target as Node)) callback();
    }

    document.addEventListener('click', handleClick);

    // Return unsubscribe function
    return {
        destroy() {
            document.removeEventListener('click', handleClick);
        },
    };
}
