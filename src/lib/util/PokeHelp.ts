/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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

import { findLastIndex, forEach, groupBy, last } from 'lodash';
import { SHA256 } from 'crypto-js';
import { RiTa } from 'rita';
import { syllable } from 'syllable';

// Hash-based approach with salt allows us to deterministically define colors
// Since the number of phonemes is limited it is possible to find salt which would produce more or less pleasant colors for all phonemes
const SALT_FOR_COLORS = 'pokeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export function highlightWords(text: string, lines: string[]): string[] {
	const lastWordOnLineMap = lines.map((line) =>
		last(
			line
				.trim()
				.replace(/[^\w\s]/gi, '')
				.split(/\s+/)
		)
	);
	const rhymeGroups = groupBy(lastWordOnLineMap, getPhonesAfterLastVowel);
	const colors = rhymeGroupsToColors(rhymeGroups);
	return colorCodeWords(text, rhymeGroups, colors);
}

export function putSyllables(lines: string[]) {
	const lineSyllablesArray = (() => {
		const _: number[] = [];
		lines.forEach((line) => _.push(syllable(line)));
		return _;
	})();
	const result = lines.map((line, i) => {
		if (lineSyllablesArray[i] > 0) {
			return (
				`<span class="poem-syllable-count">${lineSyllablesArray[i]}</span> ` +
				`<span style="color: transparent; margin-left: 5px">${line}</span>`
			);
		}
	});
	return result.join('<br>');
}

function getPhonesAfterLastVowel(word: string) {
	const wordPhoneArray = RiTa.phones(word).split('-');
	return wordPhoneArray.slice(findLastIndex(wordPhoneArray, (phone) => isVowel(phone)));
}

function isVowel(phoneme: string) {
	// ARPAbet vowel phonemes
	// https://rednoise.org/rita/reference/phones.html
	return phoneme.match(/IY|IH|EY|EH|AE|AA|AO|OW|UH|UW|ER|AX|AH|AY|AW|OY/gi);
}

function colorCodeWords(text, rhymeGroups, colors) {
	let result = text;
	forEach(rhymeGroups, (words, colorIndex) => {
		const color = colors[colorIndex];
		forEach(words, (word) => {
			const pattern = new RegExp('( |^)' + word + '(\\n|$|[ .,!?:;—-]+\\n|[ .,!?:;—-]+$)', 'gm');
			result = result
				.replace("'", '')
				.replace(
					pattern,
					` <span style="background-color:${color}; filter: blur(4px)">${word}</span>\n`
				);
		});
	});

	return result;
}

function hashToColor(str) {
	const hash = SHA256(str + SALT_FOR_COLORS).toString();
	const r = parseInt(hash.substr(0, 8), 16) % 256; // take the first 32 bits of the hash and wrap it around to fit into the range of 0-255
	const g = parseInt(hash.substr(8, 8), 16) % 256;
	const b = parseInt(hash.substr(16, 8), 16) % 256;
	return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

function rhymeGroupsToColors(rhymeGroups) {
	const colors = {};
	Object.keys(rhymeGroups).forEach((rhyme) => {
		colors[rhyme] = hashToColor(rhyme);
	});
	return colors;
}
