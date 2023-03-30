import { writable } from "svelte/store";
import { browser } from '$app/environment';

let storageMode;

if (browser) {
    const storageStored = localStorage.storageMode;
    storageMode = writable(storageStored || 'local')
    storageMode.subscribe((value) => localStorage.storageMode = value)
}

export { storageMode };
