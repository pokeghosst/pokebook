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

import type { InvokeArgs } from '$lib/util/tauri';
import { invoke } from '$lib/util/tauri.js';
import type {
	GetOptions,
	GetResult,
	PreferencesPlugin,
	RemoveOptions,
	SetOptions
} from './PreferencesPlugin';

export class PreferencesTauri implements PreferencesPlugin {
	async get(options: InvokeArgs<GetOptions>): Promise<GetResult> {
		const value = await invoke<string | null>('get_from_store', options);

		return { value };
	}
	async set(options: InvokeArgs<SetOptions>): Promise<void> {
		await invoke('set_to_store', { ...options });
	}
	async remove(options: InvokeArgs<RemoveOptions>): Promise<void> {
		await invoke('delete_key_in_store', options);
	}
	async clear(): Promise<void> {
		await invoke('clear_store');
	}
}
