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

import { Database } from '$lib/plugins/Database';
import { CloudStorage } from '../plugins/CloudStorage';

import { PoemDoc, type SyncPlanResponse } from '@pokebook/shared';
import { putPartialUpdate } from './poems.service';

// Batch size for processing documents
const BATCH_SIZE = 10;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function sync() {
	try {
		const localFiles = await Database.list();

		console.log('[Sync] Starting sync with', localFiles.length, 'local documents');

		console.log(localFiles);

		// Step 1: Get sync plan from server
		const syncPlan = await CloudStorage.computeSyncPlan(
			localFiles.map((file) => ({
				documentId: file.id,
				stateVector: file.stateVector
			}))
		);

		console.log('[Sync] Sync plan:', {
			newRemote: syncPlan.newRemoteDocuments.length,
			newLocal: syncPlan.newLocalDocuments.length,
			toSync: syncPlan.documentsToSync.length
		});

		// Step 2: Process all sync operations in parallel
		await Promise.all([
			processNewRemoteDocuments(syncPlan.newRemoteDocuments),
			processNewLocalDocuments(syncPlan.newLocalDocuments),
			processBidirectionalSync(syncPlan.documentsToSync)
		]);

		console.log('[Sync] Sync completed successfully');
	} catch (e: unknown) {
		console.error('[Sync] Sync failed:', e);

		if (e instanceof Error) {
			const message = e.message;

			switch (message) {
				case 'Not authenticated':
					throw new Error('errors.authentication');
				default:
					throw new Error('errors.unknown');
			}
		}
	}
}

async function processNewRemoteDocuments(
	newRemoteDocuments: SyncPlanResponse['newRemoteDocuments']
) {
	if (newRemoteDocuments.length === 0) return;

	console.log('[Sync] Downloading', newRemoteDocuments.length, 'new remote documents');

	// Download all new remote documents with retry
	for (const doc of newRemoteDocuments) {
		await retryWithBackoff(async () => {
			// Download the document's full state
			const downloaded = await CloudStorage.download([doc.fileId]);

			if (downloaded.length > 0) {
				const record = downloaded[0];
				await Database.save({
					...record,
					remoteId: doc.fileId
				});
				console.log('[Sync] Downloaded document:', doc.documentId);
			}
		});
	}
}

async function processNewLocalDocuments(newLocalDocuments: SyncPlanResponse['newLocalDocuments']) {
	if (newLocalDocuments.length === 0) return;

	console.log('[Sync] Uploading', newLocalDocuments.length, 'new local documents');

	// Upload all new local documents with retry
	for (const doc of newLocalDocuments) {
		await retryWithBackoff(async () => {
			const localRecord = await Database.get(doc.documentId);
			if (!localRecord) {
				console.warn('[Sync] Local document not found:', doc.documentId);
				return;
			}

			const result = await CloudStorage.createDocument({
				documentId: doc.documentId,
				initialState: localRecord.syncState,
				stateVector: localRecord.stateVector,
				metadata: {
					name: localRecord.name,
					snippet: localRecord.snippet,
					createdAt: localRecord.createdAt,
					updatedAt: localRecord.updatedAt
				}
			});

			// Update local record with remote ID
			await putPartialUpdate(doc.documentId, { remoteId: result.fileId });
			console.log('[Sync] Uploaded document:', doc.documentId);
		});
	}
}

async function processBidirectionalSync(documentsToSync: SyncPlanResponse['documentsToSync']) {
	if (documentsToSync.length === 0) return;

	console.log('[Sync] Syncing', documentsToSync.length, 'documents bidirectionally');

	// Process in batches
	const batches = chunkArray(documentsToSync, BATCH_SIZE);

	for (const batch of batches) {
		await retryWithBackoff(async () => {
			// Compute local diffs for all documents in batch
			const pushUpdates = await Promise.all(
				batch.map(async (doc) => {
					const localRecord = await Database.get(doc.documentId);
					if (!localRecord) return null;

					const poemDoc = PoemDoc.fromEncodedState(localRecord.syncState);

					// Compute what server is missing
					const update = poemDoc.getEncodedDiffUpdate(doc.serverVector);

					return {
						documentId: doc.documentId,
						update,
						newVector: poemDoc.getEncodedStateVector()
					};
				})
			);

			const pullRequests = batch.map((doc) => ({
				documentId: doc.documentId,
				clientVector: doc.localVector
			}));

			// Single API call: push our diffs and pull server diffs
			const result = await CloudStorage.exchangeUpdates({
				pushUpdates: pushUpdates.filter((u) => u !== null),
				pullRequests
			});

			// Apply all server diffs to local documents
			await Promise.all(
				result.pullUpdates.map(async (update) => {
					const localRecord = await Database.get(update.documentId);
					if (!localRecord) return;

					const poemDoc = PoemDoc.fromEncodedState(localRecord.syncState);

					// Apply server's updates
					poemDoc.applyEncodedUpdate(update.update);

					// Save merged state
					await putPartialUpdate(update.documentId, {
						name: poemDoc.getTitle().toString(),
						text: poemDoc.getText().toString(),
						note: poemDoc.getNote().toString(),
						snippet: sliceSnippet(poemDoc.getText().toString()),
						syncState: poemDoc.getEncodedState(),
						stateVector: poemDoc.getEncodedStateVector(),
						syncStateHash: await poemDoc.getEncodedStateHash(),
						updatedAt: Date.now()
					});

					console.log('[Sync] Merged document:', update.documentId);
				})
			);
		});
	}
}

// Helper functions

function chunkArray<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	retries = MAX_RETRIES,
	delay = RETRY_DELAY_MS
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (retries === 0) throw error;

		console.warn(`[Sync] Retrying after error (${retries} retries left):`, error);
		await new Promise((resolve) => setTimeout(resolve, delay));

		return retryWithBackoff(fn, retries - 1, delay * 2);
	}
}
