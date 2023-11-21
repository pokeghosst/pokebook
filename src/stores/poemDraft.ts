import { createStore } from './storeFactory';

export const draftPoemNameStore = await createStore('draft_poem_name', 'Unnamed');
export const draftPoemBodyStore = await createStore('draft_poem_text', '');
export const draftPoemNoteStore = await createStore('draft_poem_note', '');
