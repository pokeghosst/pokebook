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
import { decodeFromBase64, encodeToBase64 } from "../util/base64";
import { digestMessage } from "../util/digest";

import type { Poem } from "..";

export class PoemDoc {
  #yDoc: Y.Doc;

  constructor({ name, text, note }: Poem) {
    this.#yDoc = new Y.Doc();

    this.name.insert(0, name);
    this.text.insert(0, text);
    this.note.insert(0, note);
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

  public encodeStateAsUpdate(): Uint8Array {
    return Y.encodeStateAsUpdate(this.#yDoc);
  }

  public serialize() {
    return encodeToBase64(Y.encodeStateAsUpdate(this.#yDoc));
  }

  public getEncodedStateHash() {
    return digestMessage(this.serialize());
  }

  public getStateVector() {
    return Y.encodeStateVector(this.#yDoc);
  }

  public getEncodedStateVector() {
    return encodeToBase64(this.getStateVector());
  }

  public getDiffUpdate(targetStateVector: Uint8Array): Uint8Array {
    return Y.encodeStateAsUpdate(this.#yDoc, targetStateVector);
  }

  public getEncodedDiffUpdate(targetStateVector: string): string {
    const vector = decodeFromBase64(targetStateVector);
    return encodeToBase64(this.getDiffUpdate(vector));
  }

  public applyUpdate(update: Uint8Array) {
    Y.applyUpdate(this.#yDoc, update);
  }

  public applyEncodedUpdate(encodedUpdate: string) {
    const update = decodeFromBase64(encodedUpdate);
    this.applyUpdate(update);
  }
}
