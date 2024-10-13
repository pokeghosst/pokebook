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

import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Filesystem } from '../plugins/Filesystem';
import type { PoemFileEntity, PoemEntity } from '../types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

// import type { IPoemStorageDriver } from './IPoemStorageDriver';

// declare global {
// 	interface Window {
// 		__TAURI_INTERNAL__?: Record<string, unknown>;
// 	}
// }

// // I am NOT dealing with this just to have "end-to-end type safety" or whatever.
// // If it works correctly, it's all that matters.
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// let providerPromise: any;

// async function getImplementation() {
// 	if (!providerPromise) {
// 		if (window.__TAURI_INTERNAL__) {
// 			providerPromise = import('./FilesystemStorageDriver').then(
// 				(module) => module.FilesystemStorageDriver
// 			);
// 		} else {
// 			providerPromise = import('./WebStorageDriver').then((module) => module.WebStorageDriver);
// 		}
// 	}
// 	return providerPromise;
// }

// export const PoemLocalStorageDriver = new Proxy(
// 	{},
// 	{
// 		get(_, prop) {
// 			return async (...args: unknown[]) => {
// 				const impl = await getImplementation();
// 				const method = impl[prop];
// 				if (typeof method === 'function') {
// 					return method.apply(impl, args);
// 				} else {
// 					throw new Error(`Method ${String(prop)} does not exist on implementation`);
// 				}
// 			};
// 		}
// 	}
// ) as IPoemStorageDriver;

export const PoemLocalStorageDriver: IPoemStorageDriver = {
	listPoems: function (): Promise<PoemFileEntity[]> {
		const files = Filesystem.readDir({ path: '/' }).entries;
		console.log(files);
	},
	loadPoem: async function (poemUri: string): Promise<PoemEntity> {
		console.log('loading poem');

		const file = await Filesystem.readFile({ path: `/${poemUri}` });
		console.log(file);

		return new XMLParser().parse(file.data);
	},
	savePoem: async function (poem: PoemEntity): Promise<{ id: string; timestamp: number }> {
		const now = Date.now();

		const { uri } = await Filesystem.writeFile({
			path: `/${poem.name}_${now}.xml`,
			data: new XMLBuilder({ format: true }).build(poem)
		});

		return { id: uri, timestamp: now };
	},
	updatePoem: function (poem: PoemEntity, poemUri: string): Promise<string | void> {
		throw new Error('Function not implemented.');
	},
	deletePoem: function (poemUri: string): Promise<void> {
		throw new Error('Function not implemented.');
	}
};
