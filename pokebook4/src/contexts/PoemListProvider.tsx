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

import {
  createContext,
  createResource,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

import { Filesystem } from "@lib/plugins/Filesystem";
import { PoemCacheManager } from "@lib/plugins/PoemCacheManager";

import type { PoemCacheRecord, PoemEntity } from "@lib/types";
import type { ParentComponent } from "solid-js";

const POEM_SNIPPET_LENGTH = 256;

type PoemListContextState = {
  poems: PoemCacheRecord[];
};

type PoemListContextValue = [
  state: PoemListContextState,
  actions: {
    push: (poem: PoemEntity) => void;
    pop: (key: string) => void;
  },
];

const poemListState = { poems: [] };

const PoemListContext = createContext<PoemListContextValue>([
  poemListState,
  {
    push: () => undefined,
    pop: () => undefined,
  },
]);

export const PoemListProvider: ParentComponent<{
  poems?: PoemCacheRecord[];
}> = (props) => {
  const [poemList, setPoemList] = createStore({
    poems: [] as PoemCacheRecord[],
  });

  // console.log("loading list context");

  const push = async (poem: PoemEntity) => {
    const now = Date.now();
    const id = crypto.randomUUID();

    await Filesystem.writeFile({
      path: `/${id}.json`,
      data: JSON.stringify(poem),
    });

    const poemCacheRecord: PoemCacheRecord = {
      poemId: id,
      name: poem.name,
      createdAt: now,
      modifiedAt: now,
      unsavedChanges: false,
      poemSnippet:
        poem.text.slice(0, POEM_SNIPPET_LENGTH) +
        (poem.text.length > POEM_SNIPPET_LENGTH ? "..." : ""),
    };

    poemCacheRecord.cacheId = await PoemCacheManager.push(poemCacheRecord);

    setPoemList("poems", poemList.poems.length, poemCacheRecord);
  };
  const pop = (key: string) => alert("not implemented");

  onMount(async () => {
    // setTimeout(async () => {
    setPoemList("poems", await PoemCacheManager.list());
    // }, 1000);
  });

  return (
    <PoemListContext.Provider value={[poemList, { push, pop }]}>
      {props.children}
    </PoemListContext.Provider>
  );
};

export const usePoemList = () => useContext(PoemListContext);
