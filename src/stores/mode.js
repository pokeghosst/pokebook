import { writable } from "svelte/store";
import { browser } from '$app/environment';

let darkMode;
let dayTheme;
let nightTheme;

if (browser) {
    const modeStored = localStorage.darkMode;
    darkMode = writable(modeStored || '')
    darkMode.subscribe((value) => localStorage.darkMode = value)

    const dayThemeStored = localStorage.dayTheme;
    dayTheme = writable(dayThemeStored || 'vanilla')
    dayTheme.subscribe((value) => localStorage.dayTheme = value)

    const nightThemeStored = localStorage.nightTheme;
    nightTheme = writable(nightThemeStored || 'chocolate')
    nightTheme.subscribe((value) => localStorage.nightTheme = value)
}

export { darkMode, dayTheme, nightTheme };
