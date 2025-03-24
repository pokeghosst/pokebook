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

import { XMLParser } from 'fast-xml-parser';
import { Directory, Encoding, type ReadFileResult } from '@capacitor/filesystem';
import * as Y from 'yjs';

import FilesystemWithPermissions from '$lib/util/FilesystemWithPermissions';

import type { PoemEntity } from '$lib/types';
import { decodeFromBase64, encodeToBase64 } from '$lib/util/base64';

const POEM_SNIPPET_LENGTH = 256;
const MANIFEST_FILE = '.pokemanifest';

export interface PoemManifestRecord {
	filesystemPath: string;
	remoteUri?: string;
	name: string;
	snippet: string;
	createdAt: number;
	updatedAt: number;
	lastSyncedAt: number;
	unsavedChanges: boolean;
}

export class SyncManifest {
	yDoc: Y.Doc;
	poems: Y.Array<PoemManifestRecord>;
	lastSync: Y.Map<number>;

	constructor() {
		this.yDoc = new Y.Doc();
		this.poems = this.yDoc.getArray('poems');
		this.lastSync = this.yDoc.getMap('lastSync');
	}

	public static fromSerialized(data: Uint8Array): SyncManifest {
		const manifest = new SyncManifest();
		Y.applyUpdate(manifest.yDoc, data);
		return manifest;
	}

	public serialize(): Uint8Array {
		return Y.encodeStateAsUpdate(this.yDoc);
	}

	public mergeWith(otherManifest: SyncManifest) {
		const update = Y.encodeStateAsUpdate(otherManifest.yDoc);
		Y.applyUpdate(this.yDoc, update);
	}
}

class PoemManager {
	// TODO: Think later -- keep this synced to disk w/ $effect rune.
	private syncManifest: SyncManifest;

	constructor() {
		this.syncManifest = new SyncManifest();
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
					await this.rebuildManifest();
				} catch (e) {
					throw `Couldn't create poem manifest file: ${e}`;
				}
			} else {
				throw `Unexpected error: ${e}`;
			}
		}

		const manifestFile = await FilesystemWithPermissions.readFile({
			directory: Directory.Documents,
			path: `poems/${MANIFEST_FILE}`,
			encoding: Encoding.UTF8
		});
		const manifestFileContents = manifestFile.data.toString();
		const manifestData = decodeFromBase64(manifestFileContents);

		this.syncManifest = SyncManifest.fromSerialized(manifestData);
	}

	public getPoems() {
		return this.syncManifest.poems.toArray();
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
				filesystemPath: file.uri,
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

		this.syncManifest.poems.delete(0, this.syncManifest.poems.toArray().length);
		this.syncManifest.poems.insert(0, manifestContents);

		try {
			await FilesystemWithPermissions.writeFile({
				path: `poems/${MANIFEST_FILE}`,
				data: encodeToBase64(this.syncManifest.serialize()),
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
				recursive: true
			});
		} catch (e) {
			throw `Couldn't write manifest file: ${e}`;
		}

		console.log('manifest built');

		console.log(manifestContents);
	}

	public async retrieveEncodedManifestContents() {
		const manifestFile = await FilesystemWithPermissions.readFile({
			directory: Directory.Documents,
			path: `poems/${MANIFEST_FILE}`,
			encoding: Encoding.UTF8
		});
		return manifestFile.data.toString();
	}

	public getManifest() {
		return this.syncManifest;
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
					// directory: Directory.Documents,
					encoding: Encoding.UTF8
				})
			).data.toString()
		);
	}

	public async readFile(uri: string): Promise<ReadFileResult> {
		return await FilesystemWithPermissions.readFile({
			path: uri,
			encoding: Encoding.UTF8
		});
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
