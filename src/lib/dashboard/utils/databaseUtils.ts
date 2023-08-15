/**
 * Sends a request to delete a specific item or all items, based on the provided URL path and optional itemId.
 * @param {string} urlPath - URL path for the delete request.
 * @param {string | null} [itemId] - Optional item ID for deleting a specific item.
 * @returns {Promise<any>} - JSON response from the server.
 */
export async function deleteItemFromDatabaseRequest(
    urlPath: string,
    itemId?: string | null
) {
    try {
        const formData = new URLSearchParams();

        if (itemId) {
            formData.append('itemId', itemId);
        }

        const response = await fetch(urlPath, {
            method: 'POST',
            body: formData.toString(),
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            },
        });

        return response.json();
    } catch (error) {
        console.error(`Error deleting item: ${error}`);
    }
}
