import { createStore } from './storeFactory';

export const draftPoemNameStore = createStore('draft_poem_name', 'Unnamed');
export const draftPoemBodyStore = createStore('draft_poem_text', '');
export const draftPoemNoteStore = createStore('draft_poem_note', '');
