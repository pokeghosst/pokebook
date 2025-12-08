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

import type { PoemDoc } from '@pokebook/shared';

interface TextChange {
	deleteStart: number;
	deleteEnd: number;
	insertText: string;
}

export function applyEvent(
	event: InputEvent,
	poemDoc: PoemDoc,
	property: 'name' | 'text' | 'note'
): TextChange | null {
	const target = event.target as HTMLTextAreaElement | HTMLInputElement | null;
	if (!target) return null;

	const currentValue = poemDoc[property].toString();

	const { start, end } = getSelectionOffsets(target);

	const op = eventToTextChange(event, currentValue, start, end);
	if (!op) return null;

	// event.preventDefault();

	poemDoc.transact(() => {
		const { deleteStart, deleteEnd, insertText } = op;

		if (deleteEnd > deleteStart) {
			poemDoc[property].delete(deleteStart, deleteEnd - deleteStart);
		}
		if (insertText && insertText.length > 0) {
			poemDoc[property].insert(deleteStart, insertText);
		}
	});

	return op;
}

function getSelectionOffsets(el: HTMLTextAreaElement | HTMLInputElement): {
	start: number;
	end: number;
} {
	// null is returned only when accessing selectionStart property on non-text input elements
	// The fallback is more of a precaution and to avoid using `as`
	const start = el.selectionStart ?? 0;
	const end = el.selectionEnd ?? start;

	return { start, end };
}

function eventToTextChange(
	event: InputEvent,
	currentValue: string,
	start: number,
	end: number
): TextChange | null {
	const inputType = event.inputType;
	const data = event.data ?? '';

	let deleteStart = start;
	let deleteEnd = end;
	let insertText = '';

	switch (inputType) {
		// Basic inserts
		case 'insertText':
		case 'insertCompositionText':
		case 'insertReplacementText':
		// Paste / drop/ yank
		case 'insertFromPaste':
		case 'insertFromDrop':
		case 'insertFromYank':
		// Composition commit (IME)
		case 'insertFromComposition':
			insertText = data;
			break;

		case 'insertLineBreak':
		case 'insertParagraph':
			insertText = '\n';
			break;

		// Character deletions
		case 'deleteContentBackward':
			if (start === end) {
				deleteStart = Math.max(0, start - 1);
			}
			break;
		case 'deleteContentForward':
			if (start === end) {
				deleteEnd = Math.min(currentValue.length, end + 1);
			}
			break;

		// Word deletions
		case 'deleteWordBackward':
			if (start === end) {
				deleteStart = findWordBoundaryBackward(currentValue, start);
			}
			break;
		case 'deleteWordForward':
			if (start === end) {
				deleteEnd = findWordBoundaryForward(currentValue, end);
			}
			break;

		// Line deletions
		case 'deleteSoftLineBackward':
		case 'deleteHardLineBackward':
			if (start === end) {
				deleteStart = findLineStart(currentValue, start);
			}
			break;

		case 'deleteSoftLineForward':
		case 'deleteHardLineForward':
			if (start === end) {
				deleteEnd = findLineEnd(currentValue, end);
			}
			break;

		default:
			if (data) {
				insertText = data;
			} else if (deleteStart === deleteEnd) {
				return null;
			}
			break;
	}

	return { deleteStart, deleteEnd, insertText };
}

function isWordChar(ch: string): boolean {
	return /\w/.test(ch);
}

function findWordBoundaryBackward(text: string, index: number): number {
	let i = index;

	while (i > 0 && !isWordChar(text[i - 1])) i--;
	while (i > 0 && isWordChar(text[i - 1])) i--;

	return i;
}

function findWordBoundaryForward(text: string, index: number): number {
	let i = index;

	while (i < text.length && !isWordChar(text[i])) i++;
	while (i < text.length && isWordChar(text[i])) i++;

	return i;
}

function findLineStart(text: string, index: number): number {
	let i = index;
	while (i > 0 && text[i - 1] !== '\n') i--;

	return i;
}

function findLineEnd(text: string, index: number): number {
	let i = index;

	while (i < text.length && text[i] !== '\n') i++;

	return i;
}
