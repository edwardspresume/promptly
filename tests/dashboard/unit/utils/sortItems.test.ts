import { describe, expect, it, vi } from 'vitest';

import {
    booleanComparator,
    compareDate,
    compareStrings,
    sortItems,
} from '$dashboardUtils/sortItems';

describe('compareStrings', () => {
    it('compares strings correctly', () => {
        expect(compareStrings('apple', 'banana')).toBeLessThan(0);
        expect(compareStrings('banana', 'apple')).toBeGreaterThan(0);
        expect(compareStrings('banana', 'banana')).toBe(0);
        expect(compareStrings('Banana', 'banana')).toBeGreaterThan(0);
        expect(compareStrings(undefined, 'banana')).toBeLessThan(0);
        expect(compareStrings('banana', undefined)).toBeGreaterThan(0);
        expect(compareStrings(undefined, undefined)).toBe(0);
    });
});

describe('compareDate', () => {
    it('compares dates correctly', () => {
        expect(compareDate('2023-01-01', '2023-01-02')).toBeLessThan(0);
        expect(compareDate('2023-01-02', '2023-01-01')).toBeGreaterThan(0);
        expect(compareDate('2023-01-01', '2023-01-01')).toBe(0);
        expect(compareDate('2023/01/01', '2023/01/02')).toBeLessThan(0);
        expect(compareDate(undefined, '2023-01-02')).toBeLessThan(0);
        expect(compareDate('2023-01-01', undefined)).toBeGreaterThan(0);
        expect(compareDate(undefined, undefined)).toBe(0);
    });
});

describe('booleanComparator', () => {
    it('compares booleans correctly', () => {
        it('compares booleans correctly', () => {
            expect(booleanComparator(true, false)).toBeLessThan(0);
            expect(booleanComparator(false, true)).toBeGreaterThan(0);
            expect(booleanComparator(true, true)).toBe(0);
            expect(booleanComparator(false, false)).toBe(0);
            expect(booleanComparator(true, undefined)).toBeLessThan(0);
            expect(booleanComparator(undefined, true)).toBeGreaterThan(0);
            expect(booleanComparator(undefined, undefined)).toBe(0);
        });
    });
});

describe('sortItems', () => {
    const items = [
        {
            name: 'apple',
            createdAt: '2023-01-01',
            isFavorited: false,
        },
        {
            name: 'banana',
            createdAt: '2023-01-02',
            isFavorited: true,
        },
    ];

    it('sorts items by name in ascending order', () => {
        const sortedItems = sortItems(items, 'name:ascending');

        expect(sortedItems[0]?.name).toBe('apple');
    });

    it('sort items by title in descending order', () => {
        const sortedItems = sortItems(items, 'name:descending');

        expect(sortedItems[0]?.name).toBe('banana');
    });

    it('sorts items by createdAt in ascending order', () => {
        const sortedItems = sortItems(items, 'createdAt:ascending');

        expect(sortedItems[0]?.createdAt).toBe('2023-01-01');
    });

    it('sorts items by createdAt in descending order', () => {
        const sortedItems = sortItems(items, 'createdAt:descending');

        expect(sortedItems[0]?.createdAt).toBe('2023-01-02');
    });

    it('sorts items by isFavorited in descending order', () => {
        const sortedItems = sortItems(items, 'favoriteStatus:ascending');

        expect(sortedItems[0]?.isFavorited).toBe(true);
    });

    it('returns original items when invalid sort option is passed', () => {
        console.warn = vi.fn();
        const sortedItems = sortItems(items, 'invalidOption');
        expect(sortedItems).toBe(items);
        expect(console.warn).toBeCalled();
    });
});
