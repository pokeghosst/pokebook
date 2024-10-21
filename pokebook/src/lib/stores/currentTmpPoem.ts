import { writable } from 'svelte/store';

import { Preferences } from '../plugins/Preferences';
import FilesystemWithPermissions from '../util/FilesystemWithPermissions';

export const currentTmpPoemStore = async () => {
	const store = writable<string>(
		(
			await FilesystemWithPermissions.readFile({
				path: (await Preferences.get({ key: 'current_poem_uri' })).value as string
			})
		).data.toString()
	);

	return store;
};
