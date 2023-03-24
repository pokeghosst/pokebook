import { writable } from "svelte/store";
import { browser } from '$app/environment';

let darkMode;
let dayTheme;

if (browser) {
    const modeStored = localStorage.darkMode;
    darkMode = writable(modeStored || '')
    darkMode.subscribe((value) => localStorage.darkMode = value)

    const dayThemeStored = localStorage.dayTheme;
    dayTheme = writable(dayThemeStored || 'vanilla')
    dayTheme.subscribe((value) => localStorage.dayTheme = value)
}

export { darkMode, dayTheme };
