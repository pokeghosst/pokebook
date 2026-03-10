import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Preferences } from '$lib/plugins/Preferences';

export const createStore = (key: string, defaultValue: string) => {
	const store = writable<string>(defaultValue);

	if (browser)
		Preferences.get({ key }).then(({ value }) => {
			if (value !== null) store.set(value);
		});

	store.subscribe((value) => {
		if (browser) Preferences.set({ key, value });
	});

	return store;
};
