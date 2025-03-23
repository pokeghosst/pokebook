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
}
