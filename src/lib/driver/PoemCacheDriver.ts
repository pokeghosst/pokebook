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

import { Directory, Encoding, Filesystem } from '$lib/plugins/Filesystem';
import type { PoemCacheRecord, PoemEntity } from '$lib/types';
import Poem from '../models/Poem';

const SNIPPET_LENGTH = 128;

export default class PoemCacheDriver {
	public static async addPoemRecord(recordToSave: PoemCacheRecord) {
		const cachedPoemFile = await this.getCachedPoems();
		const poemCache = cachedPoemFile;

		await this.writeToCache([recordToSave].concat(poemCache));
	}

	public static async getCachedPoems(): Promise<PoemCacheRecord[]> {
		const poemCacheFile = await Filesystem.readFile({
			directory: Directory.Documents,
			path: `poems/poems_local.json`,
			encoding: Encoding.UTF8
		});

		return JSON.parse(poemCacheFile.data.toString());
	}

	public static async isCachePresent() {
		try {
			await Filesystem.stat({
				directory: Directory.Documents,
				path: `poems/poems_local.json`
			});
			return true;
		} catch (_) {
			// TODO: I reckon this is not too good
			try {
				await Filesystem.mkdir({
					path: 'poems',
					directory: Directory.Documents,
					recursive: true
				});
			} catch (_) {
				/* do nothing */
			}
			return false;
		}
	}

	public static async initCache() {
		const poemFiles = await Poem.findAll();
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
		await this.writeToCache(cachedPoems);
	}

	public static async refreshCache() {
		const poemFiles = await Poem.findAll();
		const cachedPoems = await this.getCachedPoems();
		const newCache = poemFiles.map((file) => {
			const cachedPoem = cachedPoems.find((p) => p.id === file.poemUri);
			return {
				id: file.poemUri,
				name: file.name,
				timestamp: file.timestamp,
				unsavedChanges: cachedPoem ? cachedPoem.unsavedChanges : false,
				poemSnippet: cachedPoem ? cachedPoem.poemSnippet : ''
			};
		});
		await this.writeToCache(newCache);

		return newCache;
	}

	public static async getCacheRecord(uri: string) {
		return (await this.getCachedPoems()).find((p) => p.id === uri);
	}

	public static async setUnsavedStatus(poemId: string) {
		await this.toggleUnsavedStatus(poemId, true);
	}

	public static async unsetUnsavedStatus(poemId: string) {
		await this.toggleUnsavedStatus(poemId, false);
	}

	public static async popCacheRecord(poemId: string) {
		await this.writeToCache((await this.getCachedPoems()).filter((p) => p.id !== poemId));
	}

	public static async updateCachedPoem(
		oldPoemUri: string,
		newPoemUri: string | void,
		newPoem: PoemEntity
	) {
		const poems = await this.getCachedPoems();
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
		await this.writeToCache(updatedPoems);
	}

	public static sliceSnippet(textToSlice: string) {
		return textToSlice.slice(0, SNIPPET_LENGTH);
	}

	static async toggleUnsavedStatus(poemId: string, status: boolean) {
		const cachedPoems = await this.getCachedPoems();
		const poem = cachedPoems.find((p) => p.id === poemId);
		const changedPoem: PoemCacheRecord = { ...poem, unsavedChanges: status } as PoemCacheRecord;
		await this.writeToCache(cachedPoems.map((p) => (p.id !== poemId ? p : changedPoem)));
	}

	static async writeToCache(data: PoemCacheRecord[]) {
		await Filesystem.writeFile({
			directory: Directory.Documents,
			path: `poems/poems_local.json`,
			encoding: Encoding.UTF8,
			recursive: true,
			data: JSON.stringify(data)
		});
	}
}
