import * as dbfun from './db';
import { writable } from 'svelte/store';

function createPoemStash() {

    const store = writable({});

    return {
        ...store,
        init: async () => {
            const poems = dbfun.getAllPoems();
            poems.then(poem => {
                store.set(poem);
            })
            return poems;
        },
        set: async (newPoem) => {
            dbfun.addPoem(notes, poem)
                .then(() => {
                    return {};
                });
            store.set(newPoem);
        }
    }
}

export const stash = createPoemStash();
