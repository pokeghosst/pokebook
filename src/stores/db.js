import { Dexie } from 'dexie';
import { browser } from '$app/environment';

export const db = new Dexie('poemstash');

db.version(1).stores({
    poems: '++id, note, poem, timestamp',
});
