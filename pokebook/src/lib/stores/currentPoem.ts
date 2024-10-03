import { createStore } from './storeFactory';

export const currentPoemName = createStore('current_poem_name', 'Unnamed');
export const currentPoemBody = createStore('current_poem_text', '');
export const currentPoemNote = createStore('current_poem_note', '');
export const currentPoemUri = createStore('current_poem_uri', '');
export const currentPoemNoteUri = createStore('current_poem_note_uri', '');
export const currentPoemUnsavedChanges = createStore('current_poem_unsaved_changes', 'false');
