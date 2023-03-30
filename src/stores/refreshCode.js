import { writable } from "svelte/store";
import { browser } from '$app/environment';

let refreshCode;

if (browser) {
    const refreshCodeStored = localStorage.refreshCode;
    refreshCode = writable(refreshCodeStored || '')
    refreshCode.subscribe((value) => localStorage.refreshCode = value)
}

export { refreshCode };
