import { JSDOM } from 'jsdom';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { onOutsideClick } from '$utils/functions';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;

// Tests onOutsideClick util correctly calls callback
// when user interacts outside element
describe('onOutsideClick', () => {
    let testDiv: HTMLDivElement;
    let mockCallback: Mock;
    let unsubscribe: ReturnType<typeof onOutsideClick>;

    beforeEach(() => {
        testDiv = document.createElement('div');
        document.body.appendChild(testDiv);

        mockCallback = vi.fn();

        unsubscribe = onOutsideClick(testDiv, mockCallback);
    });

    afterEach(() => {
        // Reset callback mock
        mockCallback.mockReset();

        unsubscribe.destroy();

        document.body.removeChild(testDiv);
    });

    it('does not trigger the callback when click occurs within the element', () => {
        // Simulate a click within the testDiv.
        testDiv.click();

        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('triggers the callback when click occurs outside the element', () => {
        // Simulate a click outside the testDiv.
        document.body.click();

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('successfully removes the event listener when unsubscribe is called', () => {
        // Trigger the callback once.
        document.body.click();
        expect(mockCallback).toHaveBeenCalledTimes(1);

        // Reset the mock, unsubscribe, and click again.
        mockCallback.mockReset();
        unsubscribe.destroy();
        document.body.click();

        // Callback shouldn't be called again as event listener is removed.
        expect(mockCallback).not.toHaveBeenCalled();
    });
});
