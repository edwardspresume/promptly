import { toast } from '@zerodevx/svelte-toast';

function createToastContent(iconClass: string, message: string) {
    return `<div class="${iconClass}"></div><span>${message}</span>`;
}

export const notifySuccess = (message: string, options: object = {}) => {
    const content = createToastContent('check_mark', message);
    toast.push(content, options);
};

export const notifyError = (message: string, options: object = {}) => {
    const content = createToastContent('error_mark', message);
    toast.push(content, options);
};

export const removeLastToast = () => toast.pop({ target: 'baseModal' });
