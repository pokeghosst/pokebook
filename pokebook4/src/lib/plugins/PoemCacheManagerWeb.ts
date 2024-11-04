/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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

import { PoemCacheRecord } from "@lib/types";
import database from "./DexieManager";

import type {
  GetOptions,
  GetResult,
  PoemCacheManagerPlugin,
  PopOptions,
} from "@lib/plugins/PoemCacheManagerPlugin.ts";

export class PoemCacheManagerWeb implements PoemCacheManagerPlugin {
  get(key: string): Promise<PoemCacheRecord | null> {
    throw new Error("Method not implemented.");
  }
  pop(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  list(): Promise<PoemCacheRecord[]> {
    throw new Error("Method not implemented.");
  }
  async push(poem: PoemCacheRecord) {
    await database.poemCache.add(poem);
  }
}
