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

import { json, type RequestHandler } from '@sveltejs/kit';

import { Dropbox } from 'dropbox';
import { XMLBuilder } from 'fast-xml-parser';

import type { PoemEntity } from '$lib/types';

export const GET: RequestHandler = async ({ request, params }) => {
	const poemId = params.id;

	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	try {
		return json(
			Buffer.from(
				(
					(await new Dropbox({ accessToken: accessToken }).filesDownload({
						path: poemId
						// The error says `fileBinary` does not exist on type but it's returned in the response
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					})) as any
				).result.fileBinary
			).toString()
		);
	} catch (e) {
		return new Response('', { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	const poem = (await request.json()) as PoemEntity;

	const poemId = params.id;

	if (poemId)
		try {
			const dbx = new Dropbox({ accessToken: accessToken });
			const response = await dbx.filesUpload({
				contents: new XMLBuilder({ format: true }).build(poem),
				path: poemId,
				mode: { '.tag': 'overwrite' }
			});
			await dbx.filesMoveV2({
				from_path: poemId,
				to_path: `/${poem.name}_${response.result.name.split('_')[1]}`
			});
			return new Response('', { status: 200 });
		} catch (e) {
			console.log(e);
			return new Response('', { status: 500 });
		}
	else return new Response('', { status: 404 });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	const poemId = params.id;

	if (poemId)
		try {
			new Dropbox({ accessToken: accessToken }).filesDeleteV2({ path: poemId });
			return new Response('', { status: 200 });
		} catch (e) {
			return new Response('', { status: 500 });
		}
	else return new Response('', { status: 404 });
};
