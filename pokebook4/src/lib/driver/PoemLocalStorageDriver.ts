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

import type { PoemEntity, PoemFileEntity } from '../types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

export const PoemLocalStorageDriver: IPoemStorageDriver = {
	listPoems: async function (): Promise<PoemFileEntity[]> {
		const files = (await Filesystem.readDir({ path: '/' })).entries;
		console.log('files', files);

		return files.map((file) => ({
			name: file.name.split('_')[0].replace(/%20/g, ' '),
			poemUri: file.uri,
			timestamp: file.ctime
		}));
	},

	loadPoem: async function (poemUri: string): Promise<PoemEntity> {
		console.log('loading poem');

		const file = await Filesystem.readFile({ path: `${poemUri}` });
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
	updatePoem: async function (poem: PoemEntity, poemUri: string): Promise<string | void> {
		await Filesystem.writeFile({
			path: poemUri,
			data: new XMLBuilder({ format: true }).build(poem)
		});
		const timestamp = poemUri.split('/')[1].split(/_|\.xml/)[1];
		const newFileUri = `/${poem.name}_${timestamp}.xml`;
		await Filesystem.rename({
			from: poemUri,
			to: newFileUri
		});
		return newFileUri;
	},
	deletePoem: async function (poemUri: string): Promise<void> {
		await Filesystem.deleteFile({ path: poemUri });
	}
};
