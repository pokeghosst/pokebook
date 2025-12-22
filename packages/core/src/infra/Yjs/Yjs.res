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

type doc
type text
type transaction

@module("yjs") @new external makeDoc: unit => doc = "Doc"

@send external getText: (doc, string) => text = "getText"
@send external transact: (doc, transaction => unit) => unit = "transact"
@send external insert: (text, int, string) => unit = "insert"
@send external delete: (text, int, int) => unit = "delete"
@send external toString: text => string = "toString"
@get external length: text => int = "length"
