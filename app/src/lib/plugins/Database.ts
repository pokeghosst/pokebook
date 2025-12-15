/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { makeProxy } from '$lib/util';

import type { DatabasePlugin } from './DatabasePlugin';

let pluginInstance: DatabasePlugin | null = null;
let pluginPromise: Promise<DatabasePlugin> | null = null;

// TODO: Quadruple-check this later because if you're an idiot, `Dexie: Need to reopen db` may happen and all poems will go poof!!!
async function getImplementation(): Promise<DatabasePlugin> {
	if (pluginInstance) {
		return pluginInstance;
	}

	if (!pluginPromise) {
		if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
			pluginPromise = null;
			// pluginPromise = import('./FilesystemTauri').then((m) => new m.FilesystemTauri());
		} else {
			pluginPromise = import('./DatabaseWeb').then((m) => {
				pluginInstance = new m.DatabaseWeb();
				return pluginInstance;
			});
		}
	}
	return pluginPromise;
}

export const Database = makeProxy<DatabasePlugin>(getImplementation);
