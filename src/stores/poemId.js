import { writable } from "svelte/store";
import { browser } from '$app/environment';

let currentPoem;

if (browser) {
    const currentPoemStored = localStorage.currentPoem;
    currentPoem = writable(currentPoemStored || 0)
    currentPoem.subscribe((value) => localStorage.currentPoem = value)
}

export { currentPoem };
