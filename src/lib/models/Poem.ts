/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024, 2026 Pokeghost.

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

import { PoemLocalStorageDriver } from '$lib/driver/PoemLocalStorageDriver';
import type { PoemCacheRecord, PoemEntity, PoemFileEntity } from '$lib/types';
import PoemCacheDriver from '../driver/PoemCacheDriver';

export default class Poem {
	private static pickStorageDriver() {
		return PoemLocalStorageDriver;
	}
	public static async listFromCache(): Promise<PoemCacheRecord[]> {
		await this.initPoemCacheIfNotExists();

		return await PoemCacheDriver.getCachedPoems();
	}
	public static async findAll(): Promise<PoemFileEntity[]> {
		return (await this.pickStorageDriver().listPoems()).filter(
			(poem) => !(poem.poemUri.includes('.json') || poem.poemUri.includes('.tmp'))
		);
	}
	public static async load(id: string): Promise<PoemEntity> {
		return this.pickStorageDriver().loadPoem(id);
	}
	public static async save(poem: PoemEntity) {
		await this.initPoemCacheIfNotExists();

		const { id, timestamp } = (await this.pickStorageDriver().savePoem(poem)) as {
			id: string;
			timestamp: number;
		};

		await PoemCacheDriver.addPoemRecord({
			id,
			name: poem.name,
			timestamp,
			unsavedChanges: false,
			poemSnippet: PoemCacheDriver.sliceSnippet(poem.text)
		});
	}
	public static async delete(id: string) {
		return this.pickStorageDriver().deletePoem(id);
	}
	public static async update(
		poem: PoemEntity,
		// TODO: Refactor variable name to poemUri or similar
		id: string
	): Promise<void | string> {
		const newPoemUri = await this.pickStorageDriver().updatePoem(poem, id);

		await PoemCacheDriver.updateCachedPoem(id, newPoemUri, poem);

		return newPoemUri;
	}

	static async initPoemCacheIfNotExists() {
		const isCachePresent = await PoemCacheDriver.isCachePresent();

		if (!isCachePresent) await PoemCacheDriver.initCache();
	}
}
