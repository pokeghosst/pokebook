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

export default class CloudToken {
  #provider: string;
  #refreshToken: string;
  #expiresAt: number;

  constructor(provider: string, refreshToken: string, expiresAt: number) {
    this.#provider = provider;
    this.#refreshToken = refreshToken;
    this.#expiresAt = expiresAt;
  }
}
