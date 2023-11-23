import {
	findLastIndex,
	findKey,
	last,
	groupBy,
	reduce,
	startsWith,
	concat,
	forEach,
	type Dictionary
} from 'lodash';
import wd from 'wink-distance';
import { SHA256 } from 'crypto-js';
import rita from 'rita';
import { syllable } from 'syllable';

const LEVENSHTEIN_THRESHOLD = 1;
// Hash-based approach with salt allows us to deterministically define colors
// Since the number of phonemes is limited it is possible to find salt which would produce more or less pleasant colors for all phonemes
const SALT_FOR_COLORS = 'pokeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export function highlightWords(text: string, lines: string[]): string[] {
	let lastWords = lines.map((line) =>
		last(
			line
				.trim()
				// Remove punctiation marks and special characters
				.replace(/[^\w\s]/gi, '')
				// Split by whitespaces
				.split(/\s+/)
		)
	);
	let rhymeGroups = groupBy(lastWords, findRhyme);
	let merged = reduceRhymeGroups(rhymeGroups);
	let colors = rhymeGroupsToColors(merged);
	return colorCodeWords(text, merged, colors);
}

export function colorCodeWords(text, rhymeGroups, colors) {
	let result = text;
	forEach(rhymeGroups, (words, colorIndex) => {
		const color = colors[colorIndex];
		forEach(words, (word) => {
			const pattern = new RegExp('( |^)' + word + '(\\n|$|[ .,!?:;]+\\n|[ .,!?:;]+$)', 'gm');
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

export function reduceRhymeGroups(rhymeGroups) {
	return reduce(
		rhymeGroups,
		(result, value, key) => {
			// First we ensure that we're not calculating the distance between endings that start with different phonemes
			const startsWithKey = findKey(result, (val, k) =>
				startsWith(key, k.substring(0, key.search(',')))
			);
			// Then we calculate Levenshtein distance between these groups
			// LEVENSHTEIN_THRESHOLD of 1 means that we have some consonant in the middle or at the end
			// Eg., "more" ("ao,r") and "bored" ("ao,r,d") have distance of 1
			// On the other hand, "ghost" ("ow,s,t") and "hope" ("ow,p"), despite having same starting phoneme, have distance of 2 and do not rhyme
			// Although arguably they sound similar, dealing with such cases is out of scope (at least for now)
			const diffStringKey = findKey(
				result,
				(val, k) =>
					wd.string.levenshtein(key.replace(/[^\w\s]/gi, ''), k.replace(/[^\w\s]/gi, '')) <=
					LEVENSHTEIN_THRESHOLD
			);
			const similarKey = startsWithKey && diffStringKey;
			if (similarKey) {
				result[similarKey] = concat(result[similarKey], value);
			} else {
				result[key] = value;
			}
			return result;
		},
		{}
	);
}

function hashToColor(str) {
	const hash = SHA256(str + SALT_FOR_COLORS).toString();
	const r = parseInt(hash.substr(0, 8), 16) % 256; // take the first 32 bits of the hash and wrap it around to fit into the range of 0-255
	const g = parseInt(hash.substr(8, 8), 16) % 256;
	const b = parseInt(hash.substr(16, 8), 16) % 256;
	return `rgba(${r}, ${g}, ${b}, 0.5)`;
}

export function rhymeGroupsToColors(rhymeGroups) {
	const colors = {};
	Object.keys(rhymeGroups).forEach((rhyme, i) => {
		const color = hashToColor(rhyme);
		colors[rhyme] = color;
	});
	return colors;
}

export function findRhyme(word) {
	// Just an array of word's phonemes
	const wordPhoneArray = rita.phones(word).split('-');
	// These are phonemes that matter for rhyming
	// Look from the end until you encounter first vowel phoneme and slice
	return wordPhoneArray.slice(findLastIndex(wordPhoneArray, (phone) => isVowel(phone)));
}

function isVowel(phoneme) {
	// ARPAbet vowel phonemes
	// https://rednoise.org/rita/reference/phones.html
	return phoneme.match(/IY|IH|EY|EH|AE|AA|AO|OW|UH|UW|ER|AX|AH|AY|AW|OY/gi);
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
