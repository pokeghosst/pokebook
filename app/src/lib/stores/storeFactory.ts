import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Preferences } from '$lib/plugins/Preferences';

export const createStore = async (key: string, defaultValue: string) => {
	const store = writable<string>(
		browser ? ((await Preferences.get({ key })).value ?? defaultValue) : defaultValue
	);

	store.subscribe((value) => {
		if (browser) {
			Preferences.set({
				key,
				value
			});
		}
	});

	return store;
};
