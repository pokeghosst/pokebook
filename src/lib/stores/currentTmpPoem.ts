import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export const currentTmpPoemStore = async () => {
	const store = writable<string>(
		(
			await Filesystem.readFile({
				path: (await Preferences.get({ key: 'current_poem_uri' })).value as string
			})
		).data.toString()
	);

	// store.subscribe((value) => {
	// 	if (browser) {
	// 		Preferences.set({
	// 			key,
	// 			value
	// 		});
	// 	}
	// });

	return store;
};
