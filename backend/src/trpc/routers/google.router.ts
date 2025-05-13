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

import { poemRecordSchema } from '@pokebook/shared';
import type { PoemRecord } from '@pokebook/shared';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createOAuth2ClientFromAccessToken } from '../../services/google-auth.service';
import * as googleDrive from '../services/google-drive.service';
import { FILE_NAME_TIMESTAMP_DIVIDER } from '../services/google-drive.service';
import { protectedProcedure, router } from '../trpc';

export const googleRouter = router({
	getPokeBookFolderId: protectedProcedure.query(async ({ ctx }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

		const folderId = await googleDrive.getOrCreatePokeBookFolderId(client);

		return { folderId };
	}),
	list: protectedProcedure.query(async ({ ctx }) => {
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
	}),
	upload: protectedProcedure.input(poemRecordSchema.array()).mutation(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);
		input.forEach(async (record) => {
			await googleDrive.upload(client, record.id, record);
		});
	}),
	update: protectedProcedure.input(poemRecordSchema.array()).mutation(async ({ ctx, input }) => {
		console.log('>>>>>>>> updating poem');
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);
		input.forEach(async (record) => {
			if (!record.remoteId) return;

			await googleDrive.update(client, record.remoteId, record);
		});
	}),
	download: protectedProcedure.input(z.string().array()).query(async ({ ctx, input }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

		const files = await Promise.all(
			input.map(async (uri) => await googleDrive.download(client, uri))
		);

		return files.map((file) => file.contents as PoemRecord);
	})
});
