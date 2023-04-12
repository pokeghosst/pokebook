import { writable } from "svelte/store";
import { browser } from "$app/environment";

let poemStorageBackup;
let noteStorageBackup;
let poemNameStorageBackup;
let tmpPoemId;

if (browser) {
    const poemBackupStored = localStorage.poemStorageBackup
    poemStorageBackup = writable(poemBackupStored || "");
    poemStorageBackup.subscribe((value) => localStorage.poemStorageBackup = value)

    const noteBackupStored = localStorage.noteStorageBackup
    noteStorageBackup = writable(noteBackupStored || "");
    noteStorageBackup.subscribe((value) => localStorage.noteStorageBackup = value)

    const poemNameBackupStored = localStorage.poemNameStorageBackup
    poemNameStorageBackup = writable(poemNameBackupStored || "");
    poemNameStorageBackup.subscribe((value) => localStorage.poemNameStorageBackup = value)

    const tmpPoemIdStored = localStorage.tmpPoemId
    tmpPoemId = writable(tmpPoemIdStored || -1);
    tmpPoemId.subscribe((value) => localStorage.tmpPoemId = value)
}

export { poemStorageBackup, noteStorageBackup, poemNameStorageBackup, tmpPoemId };
