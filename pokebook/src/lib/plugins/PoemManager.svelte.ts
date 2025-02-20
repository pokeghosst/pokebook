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

import PoemCacheManager, {PoemCacheManagerFactory} from "$lib/plugins/PoemCacheManager.svelte";
import type {PoemEntity} from "$lib/types";
import FilesystemWithPermissions from "$lib/util/FilesystemWithPermissions";
import {XMLBuilder} from "fast-xml-parser";
import {Directory, Encoding} from "@capacitor/filesystem";

const POEM_SNIPPET_LENGTH = 256;

class PoemManager {

    private cacheManager: PoemCacheManager;

    constructor(cacheManager: PoemCacheManager) {
        this.cacheManager = cacheManager;
    }

    public async save(poem: PoemEntity) {
        const {id, timestamp} = await this.flushToFile(poem);

        await this.cacheManager.push(id, poem.name, timestamp, this.sliceSnippet(poem.text))
    }

    private async flushToFile(poem: PoemEntity): Promise<{ id: string, timestamp: number }> {
        const timestamp = Date.now();

        const id = (
            await FilesystemWithPermissions.writeFile({
                path: `poems/${poem.name}_${timestamp}.xml`,
                data: new XMLBuilder({ format: true }).build(poem),
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
                recursive: true
            })
        ).uri

        return {id, timestamp}
    }

    private sliceSnippet(text: string): string {
        return text.slice(0, POEM_SNIPPET_LENGTH) + (text.length > POEM_SNIPPET_LENGTH ? '...' : '');
    }
}

export const poemManager = new PoemManager(await PoemCacheManagerFactory.createPoemCacheManager())