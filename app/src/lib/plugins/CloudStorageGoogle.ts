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

import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';

import type { AppRouter } from '@pokebook/backend/src/trpc/routers';
import type { PoemRecord, RemoteFileListItem } from '@pokebook/shared';
import type { CloudStoragePlugin } from './CloudStoragePlugin';

const wsClient = createWSClient({
	url: `ws://localhost:3001`,
	connectionParams: async () => {
		return {
			token: 'supersecret'
		};
	}
});

export class CloudStorageGoogle implements CloudStoragePlugin {
	#trpc = createTRPCClient<AppRouter>({
		links: [wsLink({ client: wsClient })]
	});
	// TODO: Remove retrieving PokeBook folder ID in Google Drive backend functions
	#pokebookFolderId: string | null = null;

	async list(): Promise<RemoteFileListItem[]> {
		return await this.#trpc.google.list.query();
	}
	async upload(records: PoemRecord[]): Promise<void> {
		await this.#trpc.google.upload.mutate(records);
	}
	async update(records: PoemRecord[]): Promise<void> {
		await this.#trpc.google.update.mutate(records);
	}
	download(ids: string[]): Promise<PoemRecord[] | undefined> {
		return this.#trpc.google.download.query(ids);
	}
	delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	private async getPokebookFolderId(): Promise<string> {
		if (this.#pokebookFolderId) return this.#pokebookFolderId;

		console.log('getting pokebook folder id');
		const response = await this.#trpc.google.getPokeBookFolderId.query();
		this.#pokebookFolderId = response.folderId;

		return this.#pokebookFolderId;
	}
}
