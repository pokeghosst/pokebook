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

type yDoc
type yText

@module("yjs") @new external makeYDoc: unit => yDoc = "Doc"
@send external getText: (yDoc, string) => yText = "getText"
@send external transactY: (yDoc, unit => unit) => unit = "transact"
@send external insert: (yText, int, string) => unit = "insert"

type poem = {
  name: string,
  text: string,
  note: string,
}

type t = {
  doc: yDoc,
  nameText: yText,
  poemText: yText,
  noteText: yText,
}

let make: unit => t
let name: t => yText
let text: t => yText
let note: t => yText
let transact: (t, unit => unit) => unit
