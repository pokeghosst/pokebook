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

import { PoemCacheManager } from "@lib/plugins/PoemCacheManager";
import { Filesystem } from "./Filesystem";

import type { PoemEntity } from "@lib/types";

const POEM_SNIPPET_LENGTH = 256;

export default class PoemManager {
  // public static async listFromCache(
  //   storage: string
  // ): Promise<PoemCacheRecord[]> {
  //   await this.initPoemCacheIfNotExists(storage);

  //   return await PoemCacheDriver.getCachedPoems(storage);
  // }
  // public static async findAll(storage: string): Promise<PoemFileEntity[]> {
  //   return (await this.pickStorageDriver(storage).listPoems()).filter(
  //     (poem) =>
  //       !(poem.poemUri.includes(".json") || poem.poemUri.includes(".tmp"))
  //   );
  // }
  // public static async load(id: string, storage: string): Promise<PoemEntity> {
  //   return this.pickStorageDriver(storage).loadPoem(id);
  // }
  public static async save(poem: PoemEntity) {
    const now = Date.now();
    const id = crypto.randomUUID();

    await Filesystem.writeFile({
      path: `/${id}.json`,
      data: JSON.stringify(poem),
    });

    await PoemCacheManager.push({
      value: {
        poemId: id,
        name: poem.name,
        createdAt: now,
        modifiedAt: now,
        unsavedChanges: false,
        poemSnippet:
          poem.text.slice(0, POEM_SNIPPET_LENGTH) +
          (poem.text.length > POEM_SNIPPET_LENGTH ? "..." : ""),
      },
    });

    // setPoemCache(id, {
    //   id,
    //   name: poem.name,
    //   createdAt: timestamp,
    //   modifiedAt: timestamp,
    //   unsavedChanges: false,
    //   poemSnippet: PoemCacheDriver.sliceSnippet(poem.text),
    // });
  }
  // public static async delete(id: string, storage: string) {
  //   return this.pickStorageDriver(storage).deletePoem(id);
  // }
  // public static async update(
  //   poem: PoemEntity,
  //   // TODO: Refactor variable name to poemUri or similar
  //   id: string,
  //   storage: string
  // ): Promise<void | string> {
  //   const newPoemUri = await this.pickStorageDriver(storage).updatePoem(
  //     poem,
  //     id
  //   );

  //   await PoemCacheDriver.updateCachedPoem(storage, id, newPoemUri, poem);

  //   return newPoemUri;
  // }

  // static async initPoemCacheIfNotExists(storage: string) {
  //   const isCachePresent = await PoemCacheDriver.isCachePresent(storage);

  //   console.log("isCachePresent", isCachePresent);

  //   if (!isCachePresent) await PoemCacheDriver.initCache(storage);
  // }
}
