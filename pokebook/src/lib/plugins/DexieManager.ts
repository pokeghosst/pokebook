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

import Dexie, { type EntityTable } from 'dexie';

import type { FilesystemFile } from './FilesystemPlugin';

import type { PoemCacheRecord } from '$lib/types';

export class Database extends Dexie {
	public files!: EntityTable<FilesystemFile, 'path'>;
	public poemCache!: EntityTable<PoemCacheRecord, 'cacheId'>;

	private static instance: Database;

	private constructor() {
		super('PokeBook');
		this.version(1).stores({
			files: 'path, content, ctime, mtime',
			poemCache: '++cacheId, name, createdAt, modifiedAt, poemSnippet, unsavedChanges'
		});

		this.files = this.table('files');
		this.poemCache = this.table('poemCache');
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}
}

const database = Database.getInstance();

export default database;
