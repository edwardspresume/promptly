import { writable } from 'svelte/store';

export const isPromptFilterActive = writable<boolean>(false);
