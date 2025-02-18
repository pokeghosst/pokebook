/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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

import { GoogleDriveClient } from '../../../../lib/client/GoogleDriveClient';

import { PoemEntity } from '../../../../lib/types/PoemEntity';

import { StorageProvider } from '../../../../lib/enums/StorageProvider';
import { DropboxClient } from '../../../../lib/client/DropboxClient';

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, 'provider');
	const poemId = getRouterParam(event, 'id');
	const accessToken = getHeader(event, 'Authorization');
	const poem = (await readBody(event)) as PoemEntity;

	try {
		switch (provider) {
			case StorageProvider.DROPBOX:
				await DropboxClient.updatePoem(accessToken, poemId, poem);
				return new Response(null, { status: 200 });
			case StorageProvider.GOOGLE: {
				await GoogleDriveClient.updatePoem(accessToken, poemId, poem);
				return new Response(null, { status: 200 });
			}
			default:
				return new Response(null, { status: 400 });
		}
	} catch (e) {
		return new Response(null, { status: 500 });
	}
});
