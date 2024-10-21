import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Preferences } from '@capacitor/preferences';

export const createStore = (key: string, defaultValue: string) => {
	let capacitorValue;

	if (browser) {
		Preferences.get({ key }).then(({ value }) => {
			// console.log('got value from preferences', value);
			capacitorValue = value;
		});
	}

	const store = writable<string>(browser ? (capacitorValue ?? defaultValue) : defaultValue);
	// console.log(get(store));

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
