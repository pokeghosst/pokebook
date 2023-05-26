import { writable } from "svelte/store";
import { browser } from '$app/environment';

let currentNote;

if (browser) {
    const currentNoteStored = localStorage.currentNote;
    currentNote = writable(currentNoteStored || 0)
    currentNote.subscribe((value) => localStorage.currentNote = value)
}

export { currentNote };
