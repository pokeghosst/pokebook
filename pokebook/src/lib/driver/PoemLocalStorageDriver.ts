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

async function resolveImplementation() {
	// TODO: Revise this. There has to be a more orthodox way to do this check
	if (window.__TAURI_INTERNALS__) {
		console.log('Loading filesystem driver');
		const { FilesystemStorageDriver } = await import('./FilesystemStorageDriver');
		return FilesystemStorageDriver;
	} else {
		console.log('Loading web storage driver');
		const { WebStorageDriver } = await import('./WebStorageDriver');
		return WebStorageDriver;
	}
}

let PoemLocalStorageDriver: IPoemStorageDriver;

(async () => {
	const impl = await resolveImplementation();
	PoemLocalStorageDriver = impl;
})().catch((error) => {
	console.error('Failed to initialize the driver:', error);
	throw error;
});

export { PoemLocalStorageDriver };
