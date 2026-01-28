/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024-2026 Pokeghost.

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

import type {
	GetOptions,
	GetResult,
	PreferencesPlugin,
	RemoveOptions,
	SetOptions
} from './PreferencesPlugin';

/*
Even though localStorage is synchronous, we "pretend" that
it's async to be compatible with async providers like Tauri
*/

export class PreferencesWeb implements PreferencesPlugin {
	async get(options: GetOptions): Promise<GetResult> {
		// To safely migrate from CapacitorStorage without losing user data
		const capacitorValue = localStorage.getItem('CapacitorStorage.' + options.key);

		if (capacitorValue) {
			this.set({
				key: options.key,
				value: capacitorValue
			});
			this.remove({ key: 'CapacitorStorage.' + options.key });
		}

		const value = localStorage.getItem(options.key);

		return {
			value
		};
	}
	async set(options: SetOptions): Promise<void> {
		return localStorage.setItem(options.key, options.value);
	}
	async remove(options: RemoveOptions): Promise<void> {
		return localStorage.removeItem(options.key);
	}
	async clear(): Promise<void> {
		return localStorage.clear();
	}
}
