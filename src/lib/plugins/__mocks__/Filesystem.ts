/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2026 Pokeghost.

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

import { vi } from 'vitest';

export const Directory = { Documents: 'DOCUMENTS' };
export const Encoding = { UTF8: 'utf8' };

export const Filesystem = {
	readFile: vi.fn(),
	writeFile: vi.fn(),
	deleteFile: vi.fn(),
	readdir: vi.fn(),
	rename: vi.fn()
};
