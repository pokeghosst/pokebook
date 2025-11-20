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

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
	poemRecordSchema,
	clientDocumentMetadataSchema,
	exchangeUpdatesRequestSchema,
	createDocumentRequestSchema
} from '@pokebook/shared';
import { createOAuth2ClientFromAccessToken } from '../../services/google-auth.service';
import * as googleDrive from '../services/google-drive.service';
import { FILE_NAME_TIMESTAMP_DIVIDER } from '../services/google-drive.service';
import { protectedProcedure, router } from '../trpc';

import type { PoemRecord } from '@pokebook/shared';

const getPokeBookFolderId = protectedProcedure.query(async ({ ctx }) => {
	const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

	const folderId = await googleDrive.getOrCreatePokeBookFolderId(client);

	return { folderId };
});

const list = protectedProcedure.query(async ({ ctx }) => {
	const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

	const schemaFiles = await googleDrive.list(client);

	if (!schemaFiles) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'No poem files'
		});
	}

	return schemaFiles.flatMap((schemaFile) => {
		if (schemaFile.id && schemaFile.name) {
			const [fileName, syncStateHash] = schemaFile.name.split(FILE_NAME_TIMESTAMP_DIVIDER);
			return [
				{
					fileId: schemaFile.id,
					fileName,
					syncStateHash
				}
			];
		}
		return [];
	});
});

const upload = protectedProcedure
	.input(poemRecordSchema.array())
	.mutation(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);
		input.forEach(async (record) => {
			await googleDrive.upload(client, record.id, record);
		});
	});

const update = protectedProcedure
	.input(poemRecordSchema.array())
	.mutation(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);
		input.forEach(async (record) => {
			if (!record.remoteId) return;

			await googleDrive.update(client, record.remoteId, record);
		});
	});

const download = protectedProcedure.input(z.string().array()).query(async ({ ctx, input }) => {
	const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

	const files = await Promise.all(
		input.map(async (uri) => await googleDrive.download(client, uri))
	);

	return files.map((file) => file.contents as PoemRecord);
});

const computeSyncPlan = protectedProcedure
	.input(clientDocumentMetadataSchema.array())
	.query(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);
		const serverFiles = await googleDrive.listWithVectors(client);

		const clientDocIds = new Set(input.map((d) => d.documentId));
		const serverDocMap = new Map(serverFiles.map((f) => [f.documentId, f]));

		const newRemoteDocuments = serverFiles
			.filter((f) => !clientDocIds.has(f.documentId))
			.map((f) => ({
				documentId: f.documentId,
				fileId: f.fileId,
				metadata: f.metadata
			}));

		const newClientDocuments = input
			.filter((d) => !serverDocMap.has(d.documentId))
			.map((d) => ({ documentId: d.documentId }));

		const documentsToSync = input
			.filter((d) => serverDocMap.has(d.documentId))
			.map((d) => {
				const serverFile = serverDocMap.get(d.documentId)!;
				return {
					documentId: d.documentId,
					localVector: d.stateVector,
					serverVector: serverFile.stateVector,
					fileId: serverFile.fileId
				};
			});

		return {
			newRemoteDocuments,
			newClientDocuments,
			documentsToSync
		};
	});

const exchangeUpdates = protectedProcedure
	.input(exchangeUpdatesRequestSchema)
	.mutation(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

		// Apply all incoming updates from client
		await Promise.all(
			input.pushUpdates.map(async (push) => {
				// Find file ID for this document
				const serverFiles = await googleDrive.listWithVectors(client);
				const serverFile = serverFiles.find((f) => f.documentId === push.documentId);

				if (!serverFile) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: `Document ${push.documentId} not found on server`
					});
				}

				// Apply update
				await googleDrive.applyUpdateToDocument(
					client,
					serverFile.fileId,
					push.documentId,
					push.update,
					push.newVector,
					serverFile.syncStateHash // Will be updated in applyUpdateToDocument
				);
			})
		);

		// Compute diffs for client
		const pullUpdates = await Promise.all(
			input.pullRequests.map(async (pull) => {
				// Find file ID for this document
				const serverFiles = await googleDrive.listWithVectors(client);
				const serverFile = serverFiles.find((f) => f.documentId === pull.documentId);

				if (!serverFile) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: `Document ${pull.documentId} not found on server`
					});
				}

				// Compute what client is missing
				const diff = await googleDrive.computeDiffForClient(
					client,
					serverFile.fileId,
					pull.clientVector
				);

				return {
					documentId: pull.documentId,
					update: diff.update,
					newVector: diff.newVector
				};
			})
		);

		return { pullUpdates };
	});

const createNewDocument = protectedProcedure
	.input(createDocumentRequestSchema)
	.mutation(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

		const fileId = await googleDrive.createDocument(
			client,
			input.documentId,
			input.initialState,
			input.stateVector,
			'', // syncStateHash will be computed from state
			input.metadata
		);

		return { fileId };
	});

export const googleRouter = router({
	// Old endpoints (deprecated, keep for backward compatibility)
	getPokeBookFolderId,
	list,
	upload,
	update,
	download,

	// New vector-based endpoints
	computeSyncPlan,
	exchangeUpdates,
	createDocument: createNewDocument
});
