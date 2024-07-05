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

import { PoemDropboxStorageDriver } from '$lib/driver/PoemDropboxStorageDriver';
import { PoemGoogleDriveStorageDriver } from '$lib/driver/PoemGoogleDriveStorageDriver';
import { PoemLocalStorageDriver } from '$lib/driver/PoemLocalStorageDriver';
import BufferedPoem from './BufferedPoem';

import type { PoemEntity, PoemFileEntity } from '$lib/types';
import { BufferedPoemDriver } from '../driver/BufferedPoemDriver';

// TODO: This is more of a "poem manager", rethink this class

export default class Poem {
	private static pickStorageDriver(storage: string) {
		switch (storage) {
			case 'dropbox':
				return PoemDropboxStorageDriver;
			case 'google':
				return PoemGoogleDriveStorageDriver;
			case 'local':
				return PoemLocalStorageDriver;
			default:
				throw new Error();
		}
	}
	public static async findAll(storage: string): Promise<PoemFileEntity[]> {
		await BufferedPoemDriver.listBufferedPoems();
		return this.pickStorageDriver(storage).listPoems();
	}
	public static async load(id: string, storage: string): Promise<PoemEntity> {
		return this.pickStorageDriver(storage).loadPoem(id);
	}
	public static async save(poem: PoemEntity, storage: string) {
		const savedPoemUri = (await this.pickStorageDriver(storage).savePoem(poem)) as string;
		new BufferedPoem({
			uriOrId: savedPoemUri,
			name: poem.name,
			text: poem.text,
			note: poem.note
		}).save();
	}
	public static async delete(id: string, storage: string) {
		return this.pickStorageDriver(storage).deletePoem(id);
	}
	public static async update(
		poem: PoemEntity,
		id: string,
		storage: string
	): Promise<void | string> {
		return this.pickStorageDriver(storage).updatePoem(poem, id);
	}
}
