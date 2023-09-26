import { logError } from '$globalUtils';

/**
 * Function to prepare data for export, creating a downloadable JSON file
 * @param {Record<string, unknown>} data - The data to be exported
 * @param {string} fileType - The MIME type of the exported file
 * @returns {string} downloadUrl - The URL of the downloadable JSON file
 */
export function prepareDataForExport(data: Record<string, unknown>, fileType = 'application/json') {
	const exportBlob = new Blob([JSON.stringify(data)], { type: fileType });
	const downloadUrl = URL.createObjectURL(exportBlob);
	return downloadUrl;
}

/**
 * Function to handle the download of exported data.
 * @param {string} url - The URL of the exported data
 * @param {string} filename - The name of the exported file
 */
export function downloadData(url: string, filename = 'promptly-data.json') {
	const downloadLink = document.createElement('a');
	downloadLink.href = url;
	downloadLink.download = filename;
	downloadLink.setAttribute('aria-hidden', 'true');
	document.body.appendChild(downloadLink);
	downloadLink.click();
	if (process.env.NODE_ENV !== 'test') {
		document.body.removeChild(downloadLink);
	}
}

/**
 * Function to export user data to a JSON file
 * @param {Record<string, object>} data - The data to be exported
 */
export function exportUserData(data: Record<string, unknown>) {
	try {
		const url = prepareDataForExport(data);
		downloadData(url);
	} catch (error) {
		logError(error, 'Data export');
	}
}
