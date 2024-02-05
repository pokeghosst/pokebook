import { writable, type Writable } from 'svelte/store';

export const saveFunction: Writable<() => void> = writable();
export const discardFunction: Writable<() => void> = writable();
