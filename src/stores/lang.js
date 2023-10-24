import { writable } from "svelte/store";
import { browser } from '$app/environment';

let activeLang;

if (browser) {
    const activeLangStored = localStorage.activeLang;
    activeLang = writable(activeLangStored || 'en')
    activeLang.subscribe((value) => localStorage.activeLang = value)
}

export { activeLang };
