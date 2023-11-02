import { Preferences } from '@capacitor/preferences';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let draftPoemNameStore;
let draftPoemBodyStore;
let draftPoemNoteStore;

if (browser) {
	const draftPoemNamePref = (await Preferences.get({ key: 'draft_poem_name' })).value;
	const draftPoemBodyPref = (await Preferences.get({ key: 'draft_poem_text' })).value;
	const draftPoemNotePref = (await Preferences.get({ key: 'draft_poem_note' })).value;

	draftPoemNameStore = writable(draftPoemNamePref || 'Unnamed');
	draftPoemBodyStore = writable(draftPoemBodyPref || '');
	draftPoemNoteStore = writable(draftPoemNotePref || '');

	draftPoemNameStore.subscribe((value) => {
		console.log(value)
		Preferences.set({
			key: 'draft_poem_name',
			value: value
		});
	});

	draftPoemBodyStore.subscribe((value) => {
		console.log(value)
		Preferences.set({
			key: 'draft_poem_text',
			value: value
		});
	});

	draftPoemNoteStore.subscribe((value) => {
		console.log(value)
		Preferences.set({
			key: 'draft_poem_note',
			value: value
		});
	});
}

export { draftPoemNameStore, draftPoemBodyStore, draftPoemNoteStore };
