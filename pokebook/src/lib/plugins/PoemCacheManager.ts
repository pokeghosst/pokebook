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

import type { PoemCacheManagerPlugin } from './PoemCacheManagerPlugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pluginPromise: any;

async function getImplementation() {
	if (!pluginPromise) {
		// In theory, the issue with "window not defined" should only occur in dev mode,
		// although it's not clear why does it happen in the first place when SSR is disabled.
		// TODO: Try refreshing individual poem page in a built app without this check and see.
		if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
			return null;
			// pluginPromise = import('./FilesystemTauri').then((m) => new m.FilesystemTauri());
		} else {
			pluginPromise = import('./PoemCacheManagerWeb').then((m) => new m.PoemCacheManagerWeb());
		}
	}
	return pluginPromise;
}

export const PoemCacheManager = new Proxy(
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
) as PoemCacheManagerPlugin;
