/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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

import { createTRPCClient, httpBatchLink } from '@trpc/client';
// TODO: This is weird and not very nice but I'll look into it later
import type { AppRouter } from '@pokebook/backend/src/trpc/routers';

import type { PoemEntity, StorageDriver } from '$lib/types';
import type { PoemFile } from '@pokebook/shared';

export class GoogleDrive implements StorageDriver {
	private trpc = createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: 'http://localhost:3000/trpc',
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: 'include'
					});
				}
			})
		]
	});
	private pokeBookFolderId: string | null = null;

	async getPokeBookFolderId() {
		console.log('getting pokebook folder id');
		const response = await this.trpc.google.getPokeBookFolderId.query();
		console.log('got pokebook folder id');
		this.pokeBookFolderId = response.folderId;
	}

	async listPoems(): Promise<PoemFile[]> {
		return await this.trpc.google.listPoems.query();
	}
	loadPoem(poemUri: string): Promise<PoemEntity> {
		throw new Error('Method not implemented.');
	}
	savePoem(poem: PoemEntity): Promise<{ id: string; timestamp: number } | void> {
		throw new Error('Method not implemented.');
	}
	updatePoem(poem: PoemEntity, poemUri: string): Promise<string | void> {
		throw new Error('Method not implemented.');
	}
	deletePoem(poemUri: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	async retrieveEncodedManifest(): Promise<string | null> {
		// TODO: Store PokeBook folder ID in user preferences and use this only if it's missing
		// if (!this.pokeBookFolderId) await this.getPokeBookFolderId();

		const response = await this.trpc.google.getManifest.query();

		return response.manifest;
	}
	async createManifest(encodedManifest: string): Promise<void> {
		await this.trpc.google.createManifest.mutate({ manifest: encodedManifest });
	}
	async uploadPoems(poems: { name: string; contents: string }[]) {
		return await this.trpc.google.uploadPoems.mutate(poems);
	}
	async downloadPoems(ids: string[]) {
		return await this.trpc.google.downloadPoems.query(ids);
	}
}
