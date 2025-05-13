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

	public applyUpdate(update: Uint8Array) {
		Y.applyUpdate(this.yDoc, update);
	}
}

// export class PoemDoc {
// 	yDoc: Y.Doc;
// 	titleText: Y.Text;
// 	poemText: Y.Text;
// 	noteText: Y.Text;
// 	docId: string;

// 	constructor() {
// 		this.docId = crypto.randomUUID();
// 		this.yDoc = new Y.Doc();
// 		this.titleText = this.yDoc.getText('title');
// 		this.poemText = this.yDoc.getText('poem');
// 		this.noteText = this.yDoc.getText('note');
// 	}

// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	public static fromXml(xmlData: any) {
// 		const doc = new PoemDoc();

// 		doc.titleText.delete(0, doc.titleText.length);
// 		doc.poemText.delete(0, doc.poemText.length);
// 		doc.noteText.delete(0, doc.noteText.length);

// 		doc.titleText.insert(0, xmlData.name);
// 		doc.poemText.insert(0, xmlData.text);
// 		doc.noteText.insert(0, xmlData.note);

// 		return doc;
// 	}

// 	public toXml() {
// 		return new XMLBuilder({ format: true }).build({
// 			name: this.titleText.toString(),
// 			text: this.poemText.toString(),
// 			note: this.poemText.toString()
// 		});
// 	}

// 	public exportState() {
// 		return Y.encodeStateAsUpdate(this.yDoc);
// 	}

// 	public importState(update: Uint8Array) {
// 		Y.applyUpdate(this.yDoc, update);
// 	}
// }
