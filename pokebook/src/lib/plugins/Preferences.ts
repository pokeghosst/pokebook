/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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

import type { PreferencesPlugin } from './PreferencesPlugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pluginPromise: any;

async function getImplementation() {
	if (!pluginPromise) {
		if (window.__TAURI_INTERNALS__) {
			return null;
			// pluginPromise = import('./FilesystemTauri').then((m) => new m.FilesystemTauri());
		} else {
			pluginPromise = import('./PreferencesWeb').then((m) => new m.PreferencesWeb());
		}
	}
	return pluginPromise;
}

export const Preferences = new Proxy(
	{},
	{
		get(_, prop) {
			return async (...args: unknown[]) => {
				const impl = await getImplementation();
				const method = impl[prop];
				if (typeof method === 'function') {
					return method.apply(impl, args);
				} else {
					throw new Error(`Method ${String(prop)} does not exist on implementation`);
				}
			};
		}
	}
) as PreferencesPlugin;
