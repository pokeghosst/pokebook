/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024-2025 Pokeghost.

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
import PoemCacheManager, { type PoemCacheRecord } from '../plugins/PoemCacheManager.svelte';

import type { PoemEntity, PoemFileEntity } from '$lib/types';

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
	public static async listFromCache(storage: string): Promise<PoemCacheRecord[]> {
		await this.initPoemCacheIfNotExists(storage);

		return await PoemCacheManager.getCachedPoems(storage);
	}
	public static async findAll(storage: string): Promise<PoemFileEntity[]> {
		return (await this.pickStorageDriver(storage).listPoems()).filter(
			(poem) => !(poem.poemUri.includes('.json') || poem.poemUri.includes('.tmp'))
		);
	}
	public static async load(id: string, storage: string): Promise<PoemEntity> {
		return this.pickStorageDriver(storage).loadPoem(id);
	}
	public static async save(poem: PoemEntity, storage: string) {
		await this.initPoemCacheIfNotExists(storage);

		const { id, timestamp } = (await this.pickStorageDriver(storage).savePoem(poem)) as {
			id: string;
			timestamp: number;
		};

		await PoemCacheManager.addPoemRecord(storage, {
			id,
			name: poem.name,
			timestamp,
			unsavedChanges: false,
			poemSnippet: PoemCacheManager.sliceSnippet(poem.text)
		});
	}
	public static async delete(id: string, storage: string) {
		return this.pickStorageDriver(storage).deletePoem(id);
	}
	public static async update(
		poem: PoemEntity,
		// TODO: Refactor variable name to poemUri or similar
		id: string,
		storage: string
	): Promise<void | string> {
		const newPoemUri = await this.pickStorageDriver(storage).updatePoem(poem, id);

		await PoemCacheManager.updateCachedPoem(storage, id, newPoemUri, poem);

		return newPoemUri;
	}

	static async initPoemCacheIfNotExists(storage: string) {
		const isCachePresent = await PoemCacheManager.isCachePresent(storage);

		if (!isCachePresent) await PoemCacheManager.initCache(storage);
	}
}
