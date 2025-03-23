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

import { protectedProcedure, router } from '../trpc';
import { createOAuth2ClientFromAccessToken } from '../../services/google-auth.service';
import * as googleDrive from '../services/google-drive.service';

export const googleRouter = router({
	getPokeBookFolderId: protectedProcedure.query(async ({ ctx }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

		const folderId = await googleDrive.getOrCreatePokeBookFolderId(client);

		return { folderId };
	}),
	getManifest: protectedProcedure.query(async ({ ctx }) => {
		const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);
		const searchResult = await googleDrive.findManifest(client);

		if (searchResult && searchResult.length > 0) {
			const manifestFileId = searchResult[0].id;

			if (!manifestFileId) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Manifest has no ID'
				});
			}

			const manifest = await googleDrive.readManifest(client, manifestFileId);

			return { manifest };
		}

		return { manifest: null };
	}),
	createManifest: protectedProcedure
		.input(z.object({ manifest: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const client = await createOAuth2ClientFromAccessToken(ctx.accessToken);

			await googleDrive.createManifest(client, input.manifest);
		})
});
