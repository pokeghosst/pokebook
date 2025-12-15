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

import * as Y from "yjs";

// import type { Poem } from "./src";

export class PoemDoc {
  #yDoc: Y.Doc;

  constructor(poem?: any) {
    this.#yDoc = new Y.Doc();

    if (poem) {
      const { name, text, note } = poem;

      this.name.insert(0, name);
      this.text.insert(0, text);
      this.note.insert(0, note);
    }
  }

  get name() {
    return this.#yDoc.getText("title");
  }

  get text() {
    return this.#yDoc.getText("poem");
  }

  get note() {
    return this.#yDoc.getText("note");
  }

  public transact(fn: () => void) {
    this.#yDoc.transact(fn);
  }
}
