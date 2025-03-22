import { createStore } from './storeFactory';

export const currentPoemName = await createStore('current_poem_name', 'Unnamed');
export const currentPoemBody = await createStore('current_poem_text', '');
export const currentPoemNote = await createStore('current_poem_note', '');
export const currentPoemUri = await createStore('current_poem_uri', '');
export const currentPoemNoteUri = await createStore('current_poem_note_uri', '');
export const currentPoemUnsavedChanges = await createStore('current_poem_unsaved_changes', 'false');
