/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024, 2026 Pokeghost.

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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { makeProxy } from '../util/makeProxy';
import type { PreferencesPlugin } from './PreferencesPlugin';

let pluginPromise: any;

async function getImplementation() {
	if (!pluginPromise) {
		if (window.__TAURI_INTERNALS__) {
			// throw new Error('Tauri not implemented');
			pluginPromise = import('./PreferencesTauri').then((m) => new m.PreferencesTauri());
		} else {
			pluginPromise = import('./PreferencesWeb').then((m) => new m.PreferencesWeb());
		}
	}
	return pluginPromise;
}

export const Preferences = makeProxy(getImplementation) as PreferencesPlugin;
