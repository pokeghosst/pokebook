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

	public mergeWith(otherPoemDoc: PoemDoc) {
		const update = Y.encodeStateAsUpdate(otherPoemDoc.yDoc);
		Y.applyUpdate(this.yDoc, update);
	}
}
