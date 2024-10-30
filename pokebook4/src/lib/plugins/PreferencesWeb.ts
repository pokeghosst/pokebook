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

import type {
  GetOptions,
  GetResult,
  PreferencesPlugin,
  RemoveOptions,
  SetOptions,
} from "./PreferencesPlugin";

export class PreferencesWeb implements PreferencesPlugin {
  get(options: GetOptions): Promise<GetResult> {
    return Promise.resolve({
      value: localStorage.getItem(options.key),
    });
  }
  set(options: SetOptions): Promise<void> {
    console.log("writing with key", options.key);
    return Promise.resolve(localStorage.setItem(options.key, options.value));
  }
  remove(options: RemoveOptions): Promise<void> {
    return Promise.resolve(localStorage.removeItem(options.key));
  }
  clear(): Promise<void> {
    return Promise.resolve(localStorage.clear());
  }
}
