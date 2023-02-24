import { writable } from "svelte/store";
import { browser } from "$app/environment";

let poemStorage;
let noteStorage;

if (browser) {
    const poemStored = localStorage.poem
    poemStorage = writable(poemStored || "");
    poemStorage.subscribe((value) => localStorage.poem = value)

    const noteStored = localStorage.note
    noteStorage = writable(noteStored || "");
    noteStorage.subscribe((value) => localStorage.note = value)
}

export {poemStorage, noteStorage};
