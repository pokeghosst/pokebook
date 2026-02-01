import { writable } from 'svelte/store';

import { Preferences } from '$lib/plugins/Preferences';
import { Filesystem } from '$lib/plugins/Filesystem';

export const currentTmpPoemStore = async () => {
	const store = writable<string>(
		(
			await Filesystem.readFile({
				path: (await Preferences.get({ key: 'current_poem_uri' })).value as string
			})
		).data.toString()
	);

	return store;
};
