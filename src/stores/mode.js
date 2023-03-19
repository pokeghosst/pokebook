import { writable } from "svelte/store";
import { browser } from '$app/environment';

let darkMode;

if (browser) {
    const modeStored = localStorage.darkMode;
    darkMode = writable(modeStored || '')
    darkMode.subscribe((value) => localStorage.darkMode = value)
}

export { darkMode };
