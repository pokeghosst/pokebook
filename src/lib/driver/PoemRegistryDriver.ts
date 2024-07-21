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

import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import Poem from '../models/Poem';

interface PoemCacheRecord {
	id: string;
	name: string;
	timestamp: string | number; // TODO: Check this later with different drivers, maybe harmonize
	unsavedChanges: boolean;
	poemSnippet: string;
}

export default class PoemRegistryDriver {
	public static async addPoemRecord(recordToSave: PoemCacheRecord) {
		let poemRegistryFile: string;

		try {
			poemRegistryFile = await this.getPoemRegistry();
		} catch (e: any) {
			await this.cachePoemsToRegistry();
			poemRegistryFile = await this.getPoemRegistry();
		}

		const poemRegistry = JSON.parse(poemRegistryFile);

		await this.writeToRegistry(JSON.stringify(poemRegistry.concat(recordToSave)));
	}

	public static async getPoemRegistry() {
		return (
			await Filesystem.readFile({
				directory: Directory.Documents,
				path: 'poems/poems.json'
			})
		).data.toString();
	}

	static async cachePoemsToRegistry() {
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
		await this.writeToRegistry(JSON.stringify(cachedPoems));
	}

	static async writeToRegistry(data: string) {
		await Filesystem.writeFile({
			directory: Directory.Documents,
			path: 'poems/poems.json',
			encoding: Encoding.UTF8,
			recursive: true,
			data: data
		});
	}
}
