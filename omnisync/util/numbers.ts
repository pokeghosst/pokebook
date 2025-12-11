/*
@pokebook/omnisync -- Syncing backend for PokeBook
Copyright (C) 2025 Pokeghost.

omnisync is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

omnisync is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

export function isNumber(n: unknown): n is number {
  return typeof n === "number" && !Number.isNaN(n);
}
