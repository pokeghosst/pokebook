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

import { decodeFromBase64 } from '$lib/util/base64';
import { poemManager, SyncManifest } from './PoemManager.svelte';

import type { StorageDriver } from '$lib/types';

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

			const localPoems = poemManager.getManifest().poems.toArray();
			const uploadedPoems = await this.syncProvider.uploadPoems(poemFilesToUpload);

			console.log('uploadedPoems', uploadedPoems);
			const uploadedPoemsMap = new Map(
				uploadedPoems.map((update) => [update.fileName, update.fileId])
			);

			const updatedPoems = localPoems.map((poem) => {
				const remoteFileId = uploadedPoemsMap.get(poem.filesystemPath.split('poems/')[1]);
				if (remoteFileId !== undefined) {
					return { ...poem, remoteFileId };
				}

				return poem;
			});

			console.log(updatedPoems);

			// const encodedManifest = await poemManager.retrieveEncodedManifestContents();
			// await this.syncProvider.createManifest(encodedManifest);

			return;
		}

		const remoteManifest = SyncManifest.fromSerialized(decodeFromBase64(remoteManifestEncoded));
		const localManifest = poemManager.getManifest();

		const localPoemRecords = poemManager.getPoems();
		const remoteManifestRecords = remoteManifest.poems.toArray();

		const poemsToUpload = localPoemRecords.filter(
			(localPoem) =>
				!remoteManifestRecords.find(
					(remotePoem) => remotePoem.filesystemPath === localPoem.filesystemPath
				)
		);
		const poemsToDownload = remoteManifestRecords.filter(
			(remotePoem) =>
				!localPoemRecords.find(
					(localPoem) => localPoem.filesystemPath === remotePoem.filesystemPath
				)
		);

		console.log('localManifest pre-merge', localManifest.poems.toArray());

		console.log('poemsToUpload', poemsToUpload);
		console.log('poemsToDownload', poemsToDownload);

		localManifest.mergeWith(remoteManifest);

		console.log('localManifest post-merge', localManifest.poems.toArray());

		// console.log('remoteManifest', remoteManifest);
		// console.log('localManifest', localManifest);

		// const remotePoems = remoteManifest.poems;

		// console.log('localPoems', localPoems.toArray());
		// console.log('remotePoems', remotePoems.toArray());
	}
}
