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

import type { AppRouter } from '@pokebook/backend/src/trpc/routers';
import type {
	PoemRecord,
	RemoteFileListItem,
	ClientDocumentMetadata,
	SyncPlanResponse,
	ExchangeUpdatesRequest,
	ExchangeUpdatesResponse,
	CreateDocumentRequest
} from '@pokebook/shared';
import type { TRPCClient } from '@trpc/client';
import type { CloudStoragePlugin } from './CloudStoragePlugin';

export class CloudStorageGoogle implements CloudStoragePlugin {
	#trpc: TRPCClient<AppRouter>;

	constructor(trpc: TRPCClient<AppRouter>) {
		this.#trpc = trpc;
	}
	// TODO: Remove retrieving PokeBook folder ID in Google Drive backend functions
	#pokebookFolderId: string | null = null;

	// Old methods (deprecated, keep for backward compatibility)
	async list(): Promise<RemoteFileListItem[]> {
		const result = await this.#trpc.google.list.query();
		// Add empty stateVector for backward compatibility
		return result.map((item) => ({ ...item, stateVector: '' }));
	}
	async upload(records: PoemRecord[]): Promise<void> {
		await this.#trpc.google.upload.mutate(records);
	}
	async update(records: PoemRecord[]): Promise<void> {
		await this.#trpc.google.update.mutate(records);
	}
	async download(ids: string[]): Promise<PoemRecord[]> {
		const result = await this.#trpc.google.download.query(ids);
		return result || [];
	}
	async delete(_id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	// New vector-based methods
	async computeSyncPlan(clientDocs: ClientDocumentMetadata[]): Promise<SyncPlanResponse> {
		console.log('Received client docs:', clientDocs);
		return await this.#trpc.google.computeSyncPlan.query(clientDocs);
	}

	async exchangeUpdates(request: ExchangeUpdatesRequest): Promise<ExchangeUpdatesResponse> {
		return await this.#trpc.google.exchangeUpdates.mutate(request);
	}

	async createDocument(request: CreateDocumentRequest): Promise<{ fileId: string }> {
		return await this.#trpc.google.createDocument.mutate(request);
	}

	private async getPokebookFolderId(): Promise<string> {
		if (this.#pokebookFolderId) return this.#pokebookFolderId;

		console.log('getting pokebook folder id');
		const response = await this.#trpc.google.getPokeBookFolderId.query();
		this.#pokebookFolderId = response.folderId;

		return this.#pokebookFolderId;
	}
}
