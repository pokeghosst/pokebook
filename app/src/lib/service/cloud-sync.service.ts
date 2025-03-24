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

import { poemManager, SyncManifest } from './PoemManager.svelte';
import { decodeFromBase64 } from '$lib/util/base64';

import type { StorageDriver } from '$lib/types';
import type { PoemFile } from '@pokebook/shared';

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

			return;
		}

		const localManifest = poemManager.getManifest();
		const remoteManifest = SyncManifest.fromSerialized(decodeFromBase64(remoteManifestEncoded));

		const localPoemRecords = localManifest.poems.toArray();
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

		console.log('poemsToUpload', poemsToUpload);
		console.log('poemsToDownload', poemsToDownload);

		// console.log('remoteManifest', remoteManifest);
		// console.log('localManifest', localManifest);

		// const remotePoems = remoteManifest.poems;

		// console.log('localPoems', localPoems.toArray());
		// console.log('remotePoems', remotePoems.toArray());
	}
}
