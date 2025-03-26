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

import type { PoemFile } from '@pokebook/shared';
import type { PoemEntity } from '$lib/types';

export interface StorageDriver {
	uploadPoems(
		poems: { name: string; contents: string }[]
	): Promise<{ fileName: string; fileId: string }[]>;
	downloadPoems(ids: string[]): Promise<{ fileId: string; contents: string }[]>;
	listPoems(): Promise<PoemFile[]>;
	loadPoem(poemUri: string): Promise<PoemEntity>;
	savePoem(poem: PoemEntity): Promise<{ id: string; timestamp: number } | void>;
	updatePoem(poem: PoemEntity, poemUri: string): Promise<string | void>;
	deletePoem(poemUri: string): Promise<void>;
	retrieveEncodedManifest(): Promise<string | null>;
	createManifest(encodedManifest: string): Promise<void>;
}
