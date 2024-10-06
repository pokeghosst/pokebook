/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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

import type { IPoemStorageDriver } from './IPoemStorageDriver';

// I am NOT dealing with this just to have "end-to-end type safety" or whatever.
// If it works correctly, it's all that matters.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let providerPromise: any;

async function getImplementation() {
	console.log('checking environment');

	if (!providerPromise) {
		// TODO: Revise this. There has to be a more orthodox way to do this check
		if (window.__TAURI_INTERNALS__) {
			console.log('we are in tauri');

			providerPromise = import('./FilesystemStorageDriver').then(
				(module) => module.FilesystemStorageDriver
			);
		} else {
			console.log('we are in web');
			providerPromise = import('./WebStorageDriver').then((module) => module.WebStorageDriver);
		}
	}
	return providerPromise;
}

export const PoemLocalStorageDriver = new Proxy(
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
) as IPoemStorageDriver;
