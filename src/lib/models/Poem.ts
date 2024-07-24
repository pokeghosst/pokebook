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

import { PoemDropboxStorageDriver } from '$lib/driver/PoemDropboxStorageDriver';
import { PoemGoogleDriveStorageDriver } from '$lib/driver/PoemGoogleDriveStorageDriver';
import { PoemLocalStorageDriver } from '$lib/driver/PoemLocalStorageDriver';
import PoemCacheDriver from '../driver/PoemCacheDriver';

import type { PoemEntity, PoemFileEntity, PoemCacheRecord } from '$lib/types';

export default class Poem {
	private static pickStorageDriver(storage: string) {
		switch (storage) {
			case 'dropbox':
				return PoemDropboxStorageDriver;
			case 'google':
				return PoemGoogleDriveStorageDriver;
			case 'local':
				return PoemLocalStorageDriver;
			default:
				throw new Error();
		}
	}
	public static async listFromCache(): Promise<PoemCacheRecord[]> {
		await this.initPoemCacheIfNotExists();

		return await PoemCacheDriver.getCachedPoems();
	}
	public static async findAll(storage: string): Promise<PoemFileEntity[]> {
		return (await this.pickStorageDriver(storage).listPoems()).filter(
			(poem) => poem.name !== 'poems.json'
		);
	}
	public static async load(id: string, storage: string): Promise<PoemEntity> {
		return this.pickStorageDriver(storage).loadPoem(id);
	}
	public static async save(poem: PoemEntity, storage: string) {
		await this.initPoemCacheIfNotExists();

		// TODO: ALL DRIVERS WILL HAVE TO RETURN ID AND TIMESTAMP
		const { id, timestamp } = (await this.pickStorageDriver(storage).savePoem(poem)) as {
			id: string;
			timestamp: number;
		};
		await PoemCacheDriver.addPoemRecord({
			id,
			name: poem.name,
			timestamp,
			unsavedChanges: false,
			poemSnippet: poem.text.slice(0, 128) + '...'
		});
	}
	public static async delete(id: string, storage: string) {
		return this.pickStorageDriver(storage).deletePoem(id);
	}
	public static async update(
		poem: PoemEntity,
		id: string,
		storage: string
	): Promise<void | string> {
		return this.pickStorageDriver(storage).updatePoem(poem, id);
	}

	static async initPoemCacheIfNotExists() {
		if (!(await PoemCacheDriver.isCachePresent())) await PoemCacheDriver.initCache();
	}
}
