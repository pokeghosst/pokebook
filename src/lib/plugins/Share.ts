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

import { makeProxy } from '../util/makeProxy';
import type { SharePlugin } from './SharePlugin';

export const Share = makeProxy<SharePlugin>(async () => {
	if (window.__TAURI_INTERNALS__) {
		/*
			TODO: This needs testing, maybe there's no need for a plugin.
			Using web plugin as the fallback for now.
		*/
		return new (await import('./ShareWeb')).ShareWeb();
	} else {
		return new (await import('./ShareWeb')).ShareWeb();
	}
});

export * from './SharePlugin';
