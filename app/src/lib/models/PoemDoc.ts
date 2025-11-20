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

import * as Y from 'yjs';
import { decodeFromBase64, encodeToBase64 } from '$lib/util/base64';

import type { PoemEntity } from '$lib/types';
import type { Text as YText } from 'yjs';
import { digestMessage } from '$lib/util/digest';

export class PoemDoc {
	yDoc: Y.Doc;
	#titleText: Y.Text;
	#poemText: Y.Text;
	#noteText: Y.Text;

	constructor() {
		this.yDoc = new Y.Doc();

		this.#titleText = this.yDoc.getText('title');
		this.#poemText = this.yDoc.getText('poem');
		this.#noteText = this.yDoc.getText('note');
	}

	public static fromPoem(poem: PoemEntity) {
		const doc = new PoemDoc();

		doc.#titleText.insert(0, poem.name);
		doc.#poemText.insert(0, poem.text);
		doc.#noteText.insert(0, poem.note);

		return doc;
	}

	public static fromEncodedState(update: string) {
		console.log(update);
		const doc = new PoemDoc();
		const stateArray: Uint8Array = decodeFromBase64(update);

		Y.applyUpdate(doc.yDoc, stateArray);

		return doc;
	}

	public getTitle() {
		return this.#titleText;
	}

	public getText() {
		return this.#poemText;
	}

	public getNote() {
		return this.#noteText;
	}

	public setTitle(title: YText) {
		this.#titleText = title;

		return this;
	}

	public setText(text: YText) {
		this.#poemText = text;

		return this;
	}

	public setNote(note: YText) {
		this.#noteText = note;

		return this;
	}

	public getState() {
		return Y.encodeStateAsUpdate(this.yDoc);
	}

	public getEncodedState() {
		return encodeToBase64(Y.encodeStateAsUpdate(this.yDoc));
	}

	public getEncodedStateHash() {
		return digestMessage(this.getEncodedState());
	}

	public getStateVector() {
		return Y.encodeStateVector(this.yDoc);
	}

	public getEncodedStateVector() {
		return encodeToBase64(this.getStateVector());
	}

	public getDiffUpdate(targetStateVector: Uint8Array): Uint8Array {
		return Y.encodeStateAsUpdate(this.yDoc, targetStateVector);
	}

	public getEncodedDiffUpdate(targetStateVector: string): string {
		const vector = decodeFromBase64(targetStateVector);
		return encodeToBase64(this.getDiffUpdate(vector));
	}

	public applyUpdate(update: Uint8Array) {
		Y.applyUpdate(this.yDoc, update);
	}

	public applyEncodedUpdate(encodedUpdate: string) {
		const update = decodeFromBase64(encodedUpdate);
		this.applyUpdate(update);
	}
}
