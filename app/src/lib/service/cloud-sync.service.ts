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

import { decodeFromBase64, encodeToBase64 } from '$lib/util/base64';
import { poemManager, SyncManifest } from './PoemManager.svelte';

import { PoemDoc } from '$lib/models/PoemDoc';
import type { PoemEntity, StorageDriver } from '$lib/types';
import { XMLParser } from 'fast-xml-parser';

export class SyncManager {
	private syncProvider: StorageDriver;

	constructor(syncProvider: StorageDriver) {
		this.syncProvider = syncProvider;
	}

	async getRemoteManifest() {
		return this.syncProvider.retrieveEncodedManifest();
	}

	async createManifest(encodedManifest: string) {
		await this.syncProvider.createManifest(encodedManifest);
	}

	async sync() {
		const remoteManifestEncoded = await this.getRemoteManifest();

		if (!remoteManifestEncoded) {
			// If there is no remote manifest, ignore whatever is in the folder assuming it doesn't belong to PokeBook
			// Otherwise, how did it get here?

			const poemContentPromises = poemManager.getPoems().map(async (poem) => {
				const name = poem.filesystemPath.split('poems/')[1];
				const fileResult = await poemManager.readFile(poem.filesystemPath);
				const contents = fileResult.data.toString();

				return { name, contents };
			});

			const poemFilesToUpload = await Promise.all(poemContentPromises);

			const localManifest = poemManager.getManifest();
			const localPoems = poemManager.getManifest().getAllPoems();
			const uploadedPoems = await this.syncProvider.uploadPoems(poemFilesToUpload);

			console.log('uploadedPoems', uploadedPoems);
			const uploadedPoemsMap = new Map(
				uploadedPoems.map((update) => [update.fileName, update.fileId])
			);
			console.log('uploadedPoemsMap', uploadedPoemsMap);

			const updatedPoems = localPoems.map((poem) => {
				const remoteFileId = uploadedPoemsMap.get(poem.filesystemPath.split('poems/')[1]);
				if (remoteFileId !== undefined) {
					return { ...poem, remoteFileId };
				}

				return poem;
			});

			console.log('updatedPoems', updatedPoems);

			// localManifest.poems.delete(0, localManifest.poems.toArray().length);
			localManifest.poems.clear();
			localManifest.addPoemsInBatch(updatedPoems);

			await poemManager.flushManifestToFile();

			console.log(localManifest.getAllPoems());

			const encodedManifest = encodeToBase64(poemManager.getManifest().serialize());
			await this.syncProvider.createManifest(encodedManifest);

			console.log(poemManager.getManifest().getAllPoems());

			return;
		}

		const remoteManifest = SyncManifest.fromSerialized(decodeFromBase64(remoteManifestEncoded));
		const localManifest = poemManager.getManifest();

		const localPoemRecords = poemManager.getPoems();
		const remoteManifestRecords = remoteManifest.getAllPoems();

		console.log('remoteManifestRecords', remoteManifestRecords);

		const poemsToUpload = localPoemRecords.filter(
			(localPoem) =>
				!remoteManifestRecords.find(
					(remotePoem) => remotePoem.remoteFileId === localPoem.remoteFileId
				)
		);
		const poemsToDownload = remoteManifestRecords.filter(
			(remotePoem) =>
				!localPoemRecords.find((localPoem) => localPoem.remoteFileId === remotePoem.remoteFileId)
		);
		const poemsToMerge = localPoemRecords.filter((localPoem) => {
			const remotePoemRecord = remoteManifestRecords.find(
				(remotePoem) => remotePoem.remoteFileId === localPoem.remoteFileId
			);

			return remotePoemRecord && remotePoemRecord.hash !== localPoem.hash;
		});

		console.log('localManifest pre-merge', localManifest.getAllPoems());

		console.log('poemsToUpload', poemsToUpload);
		console.log('poemsToDownload', poemsToDownload);
		console.log('poemsToMerge', poemsToMerge);

		localManifest.mergeWith(remoteManifest);

		console.log('localManifest post-merge', localManifest.getAllPoems());

		const poemIdsToDownload = poemsToDownload.flatMap((poem) =>
			poem.remoteFileId ? [poem.remoteFileId] : []
		);

		const downloadedPoems = await this.syncProvider.downloadPoems(poemIdsToDownload);

		console.log('downloadedPoems', downloadedPoems);

		const localPoemArray = localManifest.getAllPoems();

		const poemNameMap = new Map(
			localPoemArray.map((poem) => [poem.remoteFileId, poem.filesystemPath.split('poems/')[1]])
		);

		console.log(poemNameMap);

		for (const poem of downloadedPoems) {
			const fileName = poemNameMap.get(poem.fileId);

			if (!fileName) continue;

			poemManager.flushToFile(fileName, poem.contents);
		}

		const poemContentPromises = poemsToUpload.map(async (poem) => {
			const name = poem.filesystemPath.split('poems/')[1];
			const fileResult = await poemManager.readFile(poem.filesystemPath);
			const contents = fileResult.data.toString();

			return { name, contents };
		});

		const poemFilesToUpload = await Promise.all(poemContentPromises);
		const uploadedPoems = await this.syncProvider.uploadPoems(poemFilesToUpload);

		const uploadedPoemsMap = new Map(
			uploadedPoems.map((update) => [update.fileName, update.fileId])
		);

		uploadedPoemsMap.forEach((fileName, fileId) => {
			const localPoemRecord = localManifest.poems.get(fileName);

			if (!localPoemRecord) return;

			localPoemRecord.remoteFileId = fileId;
			localManifest.poems.set(fileName, localPoemRecord);
		});

		// MERGING POEMS

		for (const poem of poemsToMerge) {
			const remoteFileId = poem.remoteFileId;

			if (!remoteFileId) continue;

			const localPoem = await poemManager.load(poem.filesystemPath);
			const remotePoemFile = (await this.syncProvider.downloadPoems([remoteFileId]))[0];
			const remotePoem = new XMLParser().parse(remotePoemFile.contents.toString());

			console.log('remotePoem', remotePoem);

			const localPoemYDocState = localPoem.sync?.ydoc_state
				? decodeFromBase64(localPoem.sync.ydoc_state)
				: undefined;
			const remotePoemYDocState = remotePoem.sync?.ydoc_state
				? decodeFromBase64(remotePoem.sync.ydoc_state)
				: undefined;

			if (!remotePoemYDocState) return;

			const mergeBase = new PoemDoc();

			console.log('mergeBase', mergeBase.toXml());
			const localState = localPoemYDocState;

			// mergeBase.importState(localState!);

			console.log('mergeBase with local state applied', mergeBase.toXml());
			// console.log('mergeBase with local state delta', mergeBase.poemText.toDelta());

			mergeBase.importEncodedState(remotePoemYDocState!);

			console.log('mergeBase with remote state applied', mergeBase.toXml());
			console.log('mergeBase with remote state delta', mergeBase.poemText.toDelta());

			// const localPoemDoc = new PoemDoc(localPoem, localPoemYDocState);
			// const remotePoemDoc = new PoemDoc(remotePoem, remotePoemYDocState);

			// console.log('localPoemFile pre-merge', localPoemDoc.toXml());

			// localPoemDoc.applyUpdate(remotePoemYDocState);

			// const mergedFile = localPoemDoc.toXml();
			// console.log('mergedFile', mergedFile);
		}

		poemManager.flushManifestToFile();
	}
}
