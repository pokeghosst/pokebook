/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

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

import type { PoemEntity } from '$lib/types';
import FilesystemWithPermissions from '$lib/util/FilesystemWithPermissions';
import { XMLParser } from 'fast-xml-parser';
import { Directory, Encoding } from '@capacitor/filesystem';

const POEM_SNIPPET_LENGTH = 256;
const MANIFEST_FILE = 'manifest.json';

export interface PoemManifestRecord {
	id: string;
	name: string;
	snippet: string;
	createdAt: number;
	updatedAt: number;
	lastSyncedAt: number;
	unsavedChanges: boolean;
}

class PoemManager {
	// TODO: Think later -- keep this synced to disk w/ $effect rune
	private poems: PoemManifestRecord[] = $state([]);

	constructor() {
		this.poems = [];
	}

	public async init() {
		console.log('initializing poem manager...');

		try {
			await FilesystemWithPermissions.stat({
				path: `poems/${MANIFEST_FILE}`,
				directory: Directory.Documents
			});
		} catch (e) {
			if (e instanceof Error && e.message === 'Entry does not exist.') {
				try {
					await FilesystemWithPermissions.writeFile({
						path: `poems/${MANIFEST_FILE}`,
						directory: Directory.Documents,
						data: JSON.stringify([]),
						encoding: Encoding.UTF8,
						recursive: true
					});
				} catch (e) {
					throw `Couldn't create poem manifest file: ${e}`;
				}
			} else {
				throw `Unexpected error: ${e}`;
			}
		}

		this.poems = JSON.parse(
			(
				await FilesystemWithPermissions.readFile({
					directory: Directory.Documents,
					path: `poems/${MANIFEST_FILE}`,
					encoding: Encoding.UTF8
				})
			).data.toString()
		);
	}

	public getPoems() {
		return this.poems;
	}

	public async rebuildManifest(): Promise<void> {
		console.log('building manifest...');

		const dirResult = await FilesystemWithPermissions.readdir({
			path: `poems`,
			directory: Directory.Documents
		});

		const poemFiles = dirResult.files.filter((file) => file.name.endsWith('.xml'));

		const mapPromises = poemFiles.map(async (file) => {
			const fileContent = await FilesystemWithPermissions.readFile({
				path: file.uri,
				encoding: Encoding.UTF8
			});

			const xmlString = fileContent.data.toString();
			const parsedXml = new XMLParser().parse(xmlString);
			const snippet = this.sliceSnippet(parsedXml.text);

			return {
				id: file.uri,
				name: file.name.split('_')[0].replace(/%20/g, ' '),
				snippet,
				// ctime is not available on Android 7 and older devices.
				// The app targets SDK 33 (Android 13) so this fallback is pretty much just to silence the error
				createdAt: file.ctime ?? file.mtime,
				updatedAt: file.mtime,
				lastSyncedAt: 0,
				unsavedChanges: false
			};
		});

		const manifestContents = await Promise.all(mapPromises);

		try {
			await FilesystemWithPermissions.writeFile({
				path: `poems/${MANIFEST_FILE}`,
				data: JSON.stringify(manifestContents),
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
				recursive: true
			});
		} catch (e) {
			throw `Couldn't write manifest file: ${e}`;
		}

		this.poems = manifestContents;

		console.log('manifest built');
	}

	// public async save(poem: PoemEntity) {
	// 	const poemDoc = new PoemDoc(poem);
	//
	// 	const { id, timestamp } = await this.flushToFile(poem.name, poemDoc.toXml());
	//
	// 	await this.cacheManager.push(id, poem.name, timestamp, this.sliceSnippet(poem.text));
	// }

	public async load(uri: string): Promise<PoemEntity> {
		return new XMLParser().parse(
			(
				await FilesystemWithPermissions.readFile({
					path: uri,
					directory: Directory.Documents,
					encoding: Encoding.UTF8
				})
			).data.toString()
		);
	}

	private async flushToFile(
		name: string,
		data: string
	): Promise<{ id: string; timestamp: number }> {
		const timestamp = Date.now();

		const id = (
			await FilesystemWithPermissions.writeFile({
				path: `poems/${name}_${timestamp}.xml`,
				data: data,
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
				recursive: true
			})
		).uri;

		return { id, timestamp };
	}

	private sliceSnippet(text: string): string {
		return text.slice(0, POEM_SNIPPET_LENGTH) + (text.length > POEM_SNIPPET_LENGTH ? '...' : '');
	}
}

class PoemManagerFactory {
	static async createPoemManager() {
		const poemManager = new PoemManager();
		await poemManager.init();
		return poemManager;
	}
}

export const poemManager = await PoemManagerFactory.createPoemManager();
