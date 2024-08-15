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

import { Directory, Encoding } from '@capacitor/filesystem';

import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import FilesystemWithPermissions from '../util/FilesystemWithPermissions';

import type { PoemEntity, PoemFileEntity } from '$lib/types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

// TODO: This method seems safe but stupid(?)
// Consider thinking of a better solution
// try {
// 	await FilesystemWithPermissions.mkdir({
// 		path: 'poems',
// 		directory: Directory.Documents
// 	});
// } catch (_) {}

// TODO: Refactor all drivers into classes with static methods
export const PoemLocalStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		try {
			const storedFiles = (
				await FilesystemWithPermissions.readdir({
					path: 'poems/',
					directory: Directory.Documents
				})
			).files;

			const poemFiles: PoemFileEntity[] = [];
			storedFiles.forEach((file) => {
				poemFiles.push({
					name: file.name.split('_')[0].replace(/%20/g, ' '),
					poemUri: file.uri,
					// ctime is not available on Android 7 and older devices.
					// The app targets SDK 33 (Android 13) so this fallback is pretty much just to silence the error
					timestamp: file.ctime ?? file.mtime
				});
			});
			return poemFiles.sort((a, b) => (b.timestamp as number) - (a.timestamp as number));
		} catch (e) {
			if (e instanceof Error)
				if (e.message === 'Folder does not exist.') {
					return [];
				} else {
					throw e;
				}
			else throw new Error('errors.unknown');
		}
	},
	loadPoem: async function (poemUri: string) {
		return new XMLParser().parse(
			(
				await FilesystemWithPermissions.readFile({
					path: poemUri,
					encoding: Encoding.UTF8
				})
			).data.toString()
		);
	},
	savePoem: async function (poem: PoemEntity) {
		const timestamp = Date.now();
		const id = (
			await FilesystemWithPermissions.writeFile({
				path: `poems/${poem.name}_${timestamp}.xml`,
				data: new XMLBuilder({ format: true }).build(poem),
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
				recursive: true
			})
		).uri;
		return {
			id,
			timestamp
		};
	},
	updatePoem: async function (poem: PoemEntity, poemUri: string): Promise<string> {
		await FilesystemWithPermissions.writeFile({
			path: poemUri,
			data: new XMLBuilder({ format: true }).build(poem),
			encoding: Encoding.UTF8
		});
		const directory = poemUri.split('poems/')[0];
		const timestamp = poemUri.split('poems/')[1].split(/_|\.xml/)[1];
		const newFileUri = `${directory}poems/${poem.name}_${timestamp}.xml`;
		await FilesystemWithPermissions.rename({
			from: poemUri,
			to: newFileUri
		});

		return newFileUri;
	},
	deletePoem: async function (poemUri: string) {
		await FilesystemWithPermissions.deleteFile({
			path: poemUri
		});
	}
};
