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

import { createContext, useContext } from "solid-js";
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

  const push = async (poem: PoemEntity) => {
    const now = Date.now();
    const id = crypto.randomUUID();

    await Filesystem.writeFile({
      path: `/${id}.json`,
      data: JSON.stringify(poem),
    });

    await PoemCacheManager.push({
      poemId: id,
      name: poem.name,
      createdAt: now,
      modifiedAt: now,
      unsavedChanges: false,
      poemSnippet:
        poem.text.slice(0, POEM_SNIPPET_LENGTH) +
        (poem.text.length > POEM_SNIPPET_LENGTH ? "..." : ""),
    });

    setPoemList("poems", poemList.poems.length, poem);
  };
  const pop = (key: string) => undefined;

  return (
    <PoemListContext.Provider value={[poemList, { push, pop }]}>
      {props.children}
    </PoemListContext.Provider>
  );
};

export const usePoemList = () => useContext(PoemListContext);
