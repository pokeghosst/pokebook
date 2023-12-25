/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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

import type { Poem } from '$lib/types/Poem';
import { XMLBuilder } from 'fast-xml-parser';
import type { PoemFile } from '$lib/types/PoemFile';

export const GET: RequestHandler = async ({ request, url }) => {
	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	const poemId = url.searchParams.get('poemId');

	if (poemId) {
		// Load individual poem
	} else {
		const reponse = await new Dropbox({ accessToken: accessToken }).filesListFolder({ path: '' });
		const entries = reponse.result.entries;
		const files: PoemFile[] = [];
		entries.forEach((entry) => {
			files.push({
				name: entry.name.split('.xml')[0],
				poemUri: entry.id,
				timestamp: entry.server_modified
			});
		});
		return json(files);
	}

	return new Response('', { status: 200 });
};

export const POST: RequestHandler = async ({ request, url }) => {
	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	const poem = (await request.json()) as Poem;

	await new Dropbox({ accessToken: accessToken }).filesUpload({
		contents: new XMLBuilder({ format: true }).build(poem),
		path: `/${poem.name}.xml`
	});

	return new Response('', { status: 200 });
};
