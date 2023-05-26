import { writable } from "svelte/store";
import { browser } from '$app/environment';

let backupTimestamp;

if (browser) {
    const backupTimestampStored = localStorage.backupTimestamp;
    backupTimestamp = writable(backupTimestampStored || 0)
    backupTimestamp.subscribe((value) => localStorage.backupTimestamp = value)
}

export { backupTimestamp };
