/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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

import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

import { XMLBuilder, XMLParser } from 'fast-xml-parser';

import type { Poem } from '../types/Poem';
import type { PoemFile } from '../types/PoemFile';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

export const PoemLocalStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		try {
			const storedFiles = (
				await Filesystem.readdir({
					path: 'poems/',
					directory: Directory.Documents
				})
			).files;

			const poemFiles: PoemFile[] = [];
			storedFiles.forEach((file) => {
				poemFiles.push({
					name: file.name.split('_')[0].replace(/%20/g, ' '),
					poemUri: file.uri,
					// ctime is not available on Android 7 and older devices.
					// The app targets SDK 33 (Android 13) so this fallback is pretty much just to silence the error
					timestamp: file.ctime ?? file.mtime
				});
			});
			return poemFiles.sort((a, b) => b.timestamp - a.timestamp);
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
				await Filesystem.readFile({
					path: poemUri,
					encoding: Encoding.UTF8
				})
			).data.toString()
		);
	},
	savePoem: async function (poem: Poem) {
		await Filesystem.writeFile({
			path: `poems/${poem.name}_${Date.now()}.xml`,
			data: new XMLBuilder().build(poem),
			directory: Directory.Documents,
			encoding: Encoding.UTF8,
			recursive: true
		});
	},
	updatePoem: async function (poem: Poem, poemUri: string) {
		await Filesystem.writeFile({
			path: poemUri,
			data: new XMLBuilder().build(poem),
			encoding: Encoding.UTF8
		});
		const directory = poemUri.split('poems/')[0];
		const timestamp = poemUri.split('poems/')[1].split(/_|\.xml/)[1];
		const newFileUri = `${directory}poems/${poem.name}_${timestamp}.xml`;
		console.log(poemUri);
		console.log(newFileUri);
		await Filesystem.rename({
			from: poemUri,
			to: newFileUri
		});

		return newFileUri;
	},
	deletePoem: async function (poemUri: string) {
		await Filesystem.deleteFile({
			path: poemUri
		});
	}
};
