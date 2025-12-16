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

open WebAPI.Storage

let plugin: PreferencesPlugin.t = {
  get: ({key}) => {
    let result: PreferencesPlugin.getResult = {
      value: localStorage->getItem(key)->Null.make,
    }
    Promise.resolve(result)
  },
  set: ({key, value}) => {
    localStorage->setItem(~key, ~value)
    Promise.resolve()
  },
  remove: ({key}) => {
    localStorage->removeItem(key)
    Promise.resolve()
  },
  clear: () => {
    localStorage->clear
    Promise.resolve()
  },
}
