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

import { Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import Poem from '../models/Poem';

import type { PoemCacheRecord, PoemEntity } from '$lib/types';
import FilesystemWithPermissions from '../util/FilesystemWithPermissions';

const SNIPPET_LENGTH = 256;

export default class PoemCacheDriver {
	public static async addPoemRecord(storage: string, recordToSave: PoemCacheRecord) {
		const cachedPoemFile = await this.getCachedPoems(storage);
		const poemCache = cachedPoemFile;

		await this.writeToCache(storage, [recordToSave].concat(poemCache));
	}

	public static async getCachedPoems(storage: string): Promise<PoemCacheRecord[]> {
		const poemCacheFile = await FilesystemWithPermissions.readFile({
			directory: Directory.Documents,
			path: `poems/poems_${storage}.json`,
			encoding: Encoding.UTF8
		});

		return JSON.parse(poemCacheFile.data.toString());
	}

	public static async isCachePresent(storage: string) {
		try {
			await FilesystemWithPermissions.stat({
				directory: Directory.Documents,
				path: `poems/poems_${storage}.json`
			});
			return true;
		} catch (e: any) {
			return false;
		}
	}

	public static async initCache(storage: string) {
		const currentStorage = (await Preferences.get({ key: 'storage_mode' })).value as string;
		const poemFiles = await Poem.findAll(currentStorage);
		const cachedPoems: PoemCacheRecord[] = poemFiles.map((file) => {
			return {
				id: file.poemUri,
				name: file.name,
				timestamp: file.timestamp,
				unsavedChanges: false,
				// Empty snippet is a tradeoff for the sake of backwards compatibility with existing poem lists.
				// Otherwise it would require loading every single poem file and snipping a bit of its contents.
				// With a big number of files on a cloud provider (+ no pagination as of now), this can take a long time.
				poemSnippet: ''
			};
		});
		await this.writeToCache(storage, cachedPoems);
	}

	public static async getCacheRecord(storage: string, uri: string) {
		return (await this.getCachedPoems(storage)).find((p) => p.id === uri);
	}

	public static async setUnsavedStatus(storage: string, poemId: string) {
		await this.toggleUnsavedStatus(storage, poemId, true);
	}

	public static async unsetUnsavedStatus(storage: string, poemId: string) {
		await this.toggleUnsavedStatus(storage, poemId, false);
	}

	public static async popCacheRecord(storage: string, poemId: string) {
		await this.writeToCache(
			storage,
			(await this.getCachedPoems(storage)).filter((p) => p.id !== poemId)
		);
	}

	public static async updateCachedPoem(
		storage: string,
		oldPoemUri: string,
		newPoemUri: string | void,
		newPoem: PoemEntity
	) {
		const poems = await this.getCachedPoems(storage);
		const updatedPoems = poems.map((poem) =>
			poem.id === oldPoemUri
				? {
						...poem,
						id: newPoemUri || poem.id,
						name: newPoem.name,
						poemSnippet: this.sliceSnippet(newPoem.text),
						unsavedChanges: false
				  }
				: poem
		);
		await this.writeToCache(storage, updatedPoems);
	}

	public static sliceSnippet(textToSlice: string) {
		return textToSlice.slice(0, SNIPPET_LENGTH) + '...';
	}

	static async toggleUnsavedStatus(storage: string, poemId: string, status: boolean) {
		const cachedPoems = await this.getCachedPoems(storage);
		const poem = cachedPoems.find((p) => p.id === poemId);
		const changedPoem: PoemCacheRecord = { ...poem, unsavedChanges: status } as PoemCacheRecord;
		await this.writeToCache(
			storage,
			cachedPoems.map((p) => (p.id !== poemId ? p : changedPoem))
		);
	}

	static async writeToCache(storage: string, data: PoemCacheRecord[]) {
		await FilesystemWithPermissions.writeFile({
			directory: Directory.Documents,
			path: `poems/poems_${storage}.json`,
			encoding: Encoding.UTF8,
			recursive: true,
			data: JSON.stringify(data)
		});
	}
}
