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

/* eslint-disable @typescript-eslint/no-explicit-any */

let pluginPromise: any;

async function getImplementation() {
	if (!pluginPromise) {
		// TODO: Import proper type after setting up Tauri
		if ((window as any).__TAURI_INTERNALS__) {
			throw new Error('Tauri not implemented');
			// pluginPromise = import('./FilesystemTauri').then((m) => new m.FilesystemTauri());
		} else {
			pluginPromise = import('./ShareWeb').then((m) => new m.ShareWeb());
		}
	}
	return pluginPromise;
}

export const Share = makeProxy(getImplementation) as SharePlugin;
