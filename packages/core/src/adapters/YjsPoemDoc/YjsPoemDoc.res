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

type state = {doc: Yjs.doc, nameText: Yjs.text, poemText: Yjs.text, noteText: Yjs.text}

let makeYLikeText = (t: Yjs.text): YLikeText.t => {
  insert: (i, s) => t->Yjs.insert(i, s),
  delete: (i, len) => t->Yjs.delete(i, len),
  length: () => t->Yjs.length,
  toString: () => t->Yjs.toString,
}

let make = (): PoemDoc.t => {
  let doc = Yjs.makeDoc()

  let s = {
    doc,
    nameText: doc->Yjs.getText("title"),
    poemText: doc->Yjs.getText("poem"),
    noteText: doc->Yjs.getText("note"),
  }

  let transact = fn => s.doc->Yjs.transact(_tx => fn())

  {
    name: () => makeYLikeText(s.nameText),
    text: () => makeYLikeText(s.poemText),
    note: () => makeYLikeText(s.noteText),
    transact,
  }
}
