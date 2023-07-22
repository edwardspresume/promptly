import { describe, expect, it, vi } from 'vitest';

import {
    booleanComparator,
    dateComparator,
    sortItems,
    stringComparator,
} from '$utils/sortItems';

describe('stringComparator', () => {
    it('compares strings correctly', () => {
        expect(stringComparator('apple', 'banana')).toBeLessThan(0);
        expect(stringComparator('banana', 'apple')).toBeGreaterThan(0);
        expect(stringComparator('banana', 'banana')).toBe(0);
        expect(stringComparator('Banana', 'banana')).toBeGreaterThan(0);
        expect(stringComparator(undefined, 'banana')).toBeLessThan(0);
        expect(stringComparator('banana', undefined)).toBeGreaterThan(0);
        expect(stringComparator(undefined, undefined)).toBe(0);
    });
});

describe('dateComparator', () => {
    it('compares dates correctly', () => {
        expect(dateComparator('2023-01-01', '2023-01-02')).toBeLessThan(0);
        expect(dateComparator('2023-01-02', '2023-01-01')).toBeGreaterThan(0);
        expect(dateComparator('2023-01-01', '2023-01-01')).toBe(0);
        expect(dateComparator('2023/01/01', '2023/01/02')).toBeLessThan(0);
        expect(dateComparator(undefined, '2023-01-02')).toBeLessThan(0);
        expect(dateComparator('2023-01-01', undefined)).toBeGreaterThan(0);
        expect(dateComparator(undefined, undefined)).toBe(0);
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
        const sortedItems = sortItems(items, 'favorite_status:ascending');

        expect(sortedItems[0]?.isFavorited).toBe(true);
    });

    it('returns original items when invalid sort option is passed', () => {
        console.warn = vi.fn();
        const sortedItems = sortItems(items, 'invalidOption');
        expect(sortedItems).toBe(items);
        expect(console.warn).toBeCalled();
    });
});
