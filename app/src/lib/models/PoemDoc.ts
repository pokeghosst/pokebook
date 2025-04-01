import * as Y from 'yjs';

import type { PoemEntity } from '$lib/types';
import { XMLBuilder } from 'fast-xml-parser';
import { encodeToBase64 } from '$lib/util/base64';

export class PoemDoc {
	yDoc: Y.Doc;
	titleText: Y.Text;
	poemText: Y.Text;
	noteText: Y.Text;

	constructor(poem?: PoemEntity, yDocState?: Uint8Array) {
		this.yDoc = new Y.Doc();

		this.titleText = this.yDoc.getText('title');
		this.poemText = this.yDoc.getText('poem');
		this.noteText = this.yDoc.getText('note');

		if (poem) {
			this.titleText.insert(0, poem.name);
			this.poemText.insert(0, poem.text);
			this.noteText.insert(0, poem.note);
		}
	}

	public getTitle() {
		return this.titleText;
	}

	public importState(update: Uint8Array) {
		Y.applyUpdate(this.yDoc, update);
	}

	public toXml() {
		const poemEntity: PoemEntity = {
			name: this.titleText.toString(),
			text: this.poemText.toString(),
			note: this.poemText.toString(),
			sync: {
				ydoc_state: encodeToBase64(Y.encodeStateAsUpdate(this.yDoc)),
				last_synced: Date.now()
			}
		};
		return new XMLBuilder({ format: true }).build(poemEntity);
	}

	public getState() {
		return encodeToBase64(Y.encodeStateAsUpdate(this.yDoc));
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
