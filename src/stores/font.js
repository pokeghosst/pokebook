import { writable } from "svelte/store";
import { browser } from '$app/environment';

let font;
let poemAlignment;

if (browser) {
    const fontStored = localStorage.font;
    font = writable(fontStored || 'halogen')
    font.subscribe((value) => localStorage.font = value)

    const poemAlignmentStored = localStorage.poemAlignment;
    poemAlignment = writable(poemAlignmentStored || 'text-left')
    poemAlignment.subscribe((value) => poemAlignment.font = value)
}

export { font, poemAlignment };
