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
import { PoemDoc } from '$lib/models/PoemDoc';
import { digestMessage } from '$lib/util/digest';

const POEM_SNIPPET_LENGTH = 256;
const MANIFEST_FILE = '.pokemanifest';

export interface PoemManifestRecord {
	filesystemPath: string;
	remoteFileId?: string;
	name: string;
	snippet: string;
	createdAt: number;
	updatedAt: number;
	hash: string;
	unsavedChanges: boolean;
}

export class SyncManifest {
	yDoc: Y.Doc;
	poems: Y.Map<PoemManifestRecord>;

	constructor() {
		this.yDoc = new Y.Doc();
		this.poems = this.yDoc.getMap('poems');
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

	public addPoem(poem: PoemManifestRecord) {
		this.poems.set(poem.filesystemPath, poem);
	}

	public addPoemsInBatch(poems: PoemManifestRecord[]) {
		this.yDoc.transact(() => {
			for (const poem of poems) {
				this.poems.set(poem.filesystemPath, poem);
			}
		});
	}

	public getAllPoems(): PoemManifestRecord[] {
		return Array.from(this.poems.values());
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

		console.log(this.syncManifest.getAllPoems());
	}

	public getPoems() {
		return Array.from(this.syncManifest.poems.values());
	}

	public async rebuildManifest(): Promise<void> {
		console.log('building manifest...');

		const dirResult = await this.readPoemDirectory();

		const poemFiles = dirResult.files.filter((file) => file.name.endsWith('.xml'));

		const mapPromises = poemFiles.map(async (file) => {
			const fileContent = await FilesystemWithPermissions.readFile({
				path: file.uri,
				encoding: Encoding.UTF8
			});

			const xmlString = fileContent.data.toString();
			const parsedXml = new XMLParser().parse(xmlString);
			const snippet = this.sliceSnippet(parsedXml.text);
			const hash = await digestMessage(xmlString);

			return {
				filesystemPath: file.uri,
				name: file.name.split('_')[0].replace(/%20/g, ' '),
				snippet,
				// ctime is not available on Android 7 and older devices.
				// The app targets SDK 33 (Android 13) so this fallback is pretty much just to silence the error
				createdAt: file.ctime ?? file.mtime,
				updatedAt: file.mtime,
				hash,
				unsavedChanges: false
			};
		});

		const oldManifestContents = this.getManifest().getAllPoems();
		const newManifestContents = await Promise.all(mapPromises);
		const newManifest = new SyncManifest();
		newManifest.addPoemsInBatch(newManifestContents);

		// this.syncManifest.poems.delete(0, this.syncManifest.poems.toArray().length);
		// this.syncManifest.poems.insert(0, manifestContents);

		try {
			await this.flushManifestToFile();
		} catch (e) {
			throw `Couldn't write manifest file: ${e}`;
		}

		console.log('manifest built');

		console.log('old manifest', oldManifestContents);
		console.log('new manifest', newManifestContents);

		this.syncManifest.mergeWith(newManifest);
		console.log('merged', this.syncManifest.getAllPoems());

		this.flushManifestToFile();
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

	// TODO: Move this to SyncManifest class
	public async flushManifestToFile() {
		await FilesystemWithPermissions.writeFile({
			path: `poems/${MANIFEST_FILE}`,
			data: encodeToBase64(this.syncManifest.serialize()),
			directory: Directory.Documents,
			encoding: Encoding.UTF8,
			recursive: true
		});
	}

	public async save(poem: PoemEntity) {
		const poemDoc = new PoemDoc(poem);

		const { id, timestamp } = await this.flushToFile(poem.name, poemDoc.toXml());

		const hash = await digestMessage(poemDoc.toXml());

		const poemRecord: PoemManifestRecord = {
			filesystemPath: id,
			name: poem.name,
			snippet: this.sliceSnippet(poem.text),
			createdAt: timestamp,
			updatedAt: timestamp,
			hash,
			unsavedChanges: false
		};

		this.syncManifest.addPoem(poemRecord);
		this.flushManifestToFile();

		return id;
	}

	public async update(uri: string, poem: PoemEntity) {
		const poemDoc = new PoemDoc(poem);
		const hash = await digestMessage(poemDoc.toXml());

		await FilesystemWithPermissions.writeFile({
			path: uri,
			data: poemDoc.toXml(),
			encoding: Encoding.UTF8
		});

		const directory = uri.split('poems/')[0];
		const timestamp = uri.split('poems/')[1].split(/_|\.xml/)[1];
		const newFileUri = `${directory}poems/${poem.name}_${timestamp}.xml`;

		await FilesystemWithPermissions.rename({
			from: uri,
			to: newFileUri
		});

		const oldPoemRecord = this.syncManifest.poems.get(uri);

		const newPoemRecord = {
			filesystemPath: newFileUri,
			remoteFileId: oldPoemRecord?.remoteFileId,
			name: poem.name,
			snippet: this.sliceSnippet(poem.text),
			createdAt: oldPoemRecord?.createdAt ?? Date.now(),
			updatedAt: Date.now(),
			hash,
			unsavedChanges: false
		};

		this.syncManifest.poems.delete(uri);
		this.syncManifest.addPoem(newPoemRecord);

		// const newManifest = Array.from(this.syncManifest.poems.values()).map((poem) => {
		// 	if (poem.filesystemPath === uri) {
		// 		return {
		// 			filesystemPath: newFileUri,
		// 			name: poem.name,
		// 			snippet: this.sliceSnippet(poem.snippet),
		// 			createdAt: poem.createdAt,
		// 			updatedAt: poem.updatedAt,
		// 			hash,
		// 			unsavedChanges: false
		// 		};
		// 	} else {
		// 		return poem;
		// 	}
		// });

		// this.syncManifest.poems.delete(0, this.syncManifest.poems.toArray().length);
		// this.syncManifest.poems.insert(0, newManifest);
		this.flushManifestToFile();

		return newFileUri;
	}

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

	// TODO: Refactor this into a more generic function with two functions on top for flushing manifest and poem file
	public async flushToFile(name: string, data: string): Promise<{ id: string; timestamp: number }> {
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

	private async readPoemDirectory() {
		try {
			return await FilesystemWithPermissions.readdir({
				path: 'poems',
				directory: Directory.Documents
			});
		} catch (e) {
			if (e instanceof Error && e.message === 'Folder does not exist.') {
				await FilesystemWithPermissions.mkdir({
					path: 'poems',
					directory: Directory.Documents
				});

				return await FilesystemWithPermissions.readdir({
					path: 'poems',
					directory: Directory.Documents
				});
			} else {
				throw new Error(`Unexpected error: ${e}`);
			}
		}
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
