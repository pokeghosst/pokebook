import { writable } from "svelte/store";
import { browser } from '$app/environment';

let viewsState;

if (browser) {
    const viewsStored = localStorage.viewsState;
    viewsState = writable(viewsStored || JSON.stringify([0,1]))
    viewsState.subscribe((value) => localStorage.viewsState = value)
}

export { viewsState };
