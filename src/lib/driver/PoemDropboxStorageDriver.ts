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

import type { Poem } from '$lib/types/Poem';
import type { PoemFile } from '$lib/types/PoemFile';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

export async function getDropboxAuthUrl() {
	const response = await fetch('/api/dropbox/auth', {
		method: 'GET'
	});
	return await response.json();
}

export const PoemDropboxStorageDriver: IPoemStorageDriver = {
	listPoems: function (): Promise<PoemFile[]> {
		throw new Error('Function not implemented.');
	},
	loadPoem: function (poemFile: PoemFile): Promise<Poem> {
		throw new Error('Function not implemented.');
	},
	savePoem: function (poem: Poem): Promise<void> {
		throw new Error('Function not implemented.');
	},
	updatePoem: function (
		poem: Poem,
		poemUri: string,
		noteUri: string
	): Promise<void | { newPoemUri: string; newNoteUri: string }> {
		throw new Error('Function not implemented.');
	},
	deletePoem: function (poemUri: string, noteUri: string): Promise<void> {
		throw new Error('Function not implemented.');
	}
};
