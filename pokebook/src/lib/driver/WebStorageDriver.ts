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

import { Encoding } from '@capacitor/filesystem';

import Dexie, { type EntityTable } from 'dexie';
import { XMLBuilder } from 'fast-xml-parser';

import FilesystemWithPermissions from '../util/FilesystemWithPermissions';

import type { PoemEntity } from '$lib/types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

const db = new Dexie('PokeBook') as Dexie & {
	poems: EntityTable<
		PoemEntity & {
			id: number;
			timestamp: number;
		},
		'id'
	>;
};

db.version(1).stores({
	poems: '++id, name, text, note, timestamp'
});

export const WebStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		try {
			return (await db.poems.toArray())
				.map((record) => ({
					name: record.name,
					// This is a bit stinky but we need to conform with poem cache interface
					// (otherwise it breaks cache file lookup)
					poemUri: record.id.toString(),
					timestamp: record.timestamp
				}))
				.sort((a, b) => b.timestamp - a.timestamp);
		} catch (e) {
			console.log(e);
			throw new Error('errors.unknown');
		}
	},
	loadPoem: async function (poemUri: string) {
		const poemRecord = await db.poems.get(parseInt(poemUri));

		console.log(poemUri, poemRecord);

		// TODO: Add error message for poem not found
		if (!poemRecord) throw new Error('errors.unknown');

		return {
			name: poemRecord.name,
			text: poemRecord.text,
			note: poemRecord.note
		};
	},
	savePoem: async function (poem: PoemEntity) {
		const timestamp = Date.now();
		const id = (await db.poems.add({ ...poem, timestamp })).toString();

		return {
			id,
			timestamp
		};
	},
	updatePoem: async function (poem: PoemEntity, poemUri: string) {
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
	deletePoem: async function (poemUri: string): Promise<void> {
		await FilesystemWithPermissions.deleteFile({
			path: poemUri
		});
	}
};
