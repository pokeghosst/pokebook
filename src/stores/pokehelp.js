import { writable } from "svelte/store";
import { browser } from '$app/environment';

let pokehelp;

if (browser) {
    const pokehelpStored = localStorage.pokehelp;
    pokehelp = writable(pokehelpStored || false)
    pokehelp.subscribe((value) => localStorage.pokehelp = value)
}

export { pokehelp };
