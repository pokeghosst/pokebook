import { writable } from "svelte/store";
import { browser } from '$app/environment';

let font;

if (browser) {
    const fontStored = localStorage.font;
    font = writable(fontStored || 'halogen')
    font.subscribe((value) => localStorage.font = value)
}

export { font };
