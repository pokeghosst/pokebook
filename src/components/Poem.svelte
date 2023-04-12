<script>
	import { count } from 'letter-count';
	import { font, poemAlignment } from '../stores/font';
	// TODO: Refactor to use RiTa for counting syllables
	import { syllable } from 'syllable';
	import {
		findLastIndex,
		findKey,
		last,
		groupBy,
		reduce,
		startsWith,
		concat,
		forEach
	} from 'lodash';
	import rita from 'rita';
	import wd from 'wink-distance';
	import { SHA256 } from 'crypto-js';
	import { onMount } from 'svelte';
	import { pokehelp } from '../stores/pokehelp';

	export let props;
	export let editable;

	let stats;
	let lines = props.poem.split('\n');
	let syllables;
	let highlightedWords;
	let poemTextarea;

	const LEVENSHTEIN_THRESHOLD = 1;
	// Hash-based approach with salt allows us to deterministically define colors
	// Since the number of phonemes is limited it is possible to find salt which would produce more or less pleasant colors for all phonemes
	const SALT_FOR_COLORS = 'pokeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

	$: lines = props.poem.split('\n');

	$: {
		if ($pokehelp == 'true') {
			let tmp = [];
			lines.forEach((line) => {
				tmp.push(syllable(line));
			});
			syllables = tmp;
			highlightedWords = highlightWords(lines);
			stats = count(props.poem);
		}
	}

	onMount(() => {
		if ($pokehelp == 'true') {
			highlightedWords = highlightWords(lines);
		}
		poemTextarea = document.getElementById('poem-textarea');
		autoHeight();
	});

	function hashToColor(str) {
		const hash = SHA256(str + SALT_FOR_COLORS).toString();
		const r = parseInt(hash.substr(0, 8), 16) % 256; // take the first 32 bits of the hash and wrap it around to fit into the range of 0-255
		const g = parseInt(hash.substr(8, 8), 16) % 256;
		const b = parseInt(hash.substr(16, 8), 16) % 256;
		return `rgba(${r}, ${g}, ${b}, 0.5)`;
	}

	function highlightWords(lines) {
		let lastWords = lines.map((line) =>
			last(
				line
					.trim()
					.replace(/[^\w\s]/gi, '')
					.split(/\s+/)
			)
		);
		let rhymeGroups = groupBy(lastWords, findRhyme);
		let merged = mergeRhymes(rhymeGroups);
		let colors = generateColorfulRhymes(merged);
		return colorCodeWords(props.poem, merged, colors);
	}

	function generateColorfulRhymes(rhymeGroups) {
		const colors = {};
		Object.keys(rhymeGroups).forEach((rhyme, i) => {
			const color = hashToColor(rhyme);
			colors[rhyme] = color;
		});
		return colors;
	}

	function colorCodeWords(text, rhymeGroups, colors) {
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

	// Reduce similar-sounding groups
	function mergeRhymes(rhymeGroups) {
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

	function findRhyme(word) {
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

	function preventChars(event) {
		const forbiddenChars = /_/g;
		props.poemName = props.poemName.replace(forbiddenChars, '');
	}

	function updateTextareaHeight() {
		autoHeight();
	}

	function autoHeight() {
		// Three lines to have some space
		const linesHeight = (lines.length + 3) * 32;
		poemTextarea.style.height = `${linesHeight}px`;
	}
</script>

<div class="notebook" id="poem-notebook">
	<input
		class="top text-white leading-[50px] pl-5 font-bold overflow-hidden"
		disabled={!editable}
		bind:value={props.poemName}
		on:input={preventChars}
	/>
	<div class="w-full relative">
		{#if $pokehelp == 'true'}
			<div class="absolute z-10 right-[5px] top-[5px]">
				Words: {stats.words} | Characters: {stats.chars} | Lines: {stats.lines}
			</div>
		{/if}
		<div class="absolute z-10 left-[5px] top-[32px] leading-[32px] opacity-70">
			{#if $pokehelp == 'true'}
				{#each syllables as syl}
					{#if syl > 0}
						({syl})<br />
					{:else}
						<br />
					{/if}
				{/each}
			{/if}
		</div>
		<div class="relative">
			{#if $pokehelp == 'true'}
				<div
					class="absolute text-transparent whitespace-pre-wrap w-full leading-[32px] pt-[35px] px-[35px] {$font} {$poemAlignment} z-10 top-0 right-0 bottom-0 left-0 pointer-events-none "
					aria-hidden="true"
				>
					{@html highlightedWords}
				</div>
			{/if}
			<textarea
				bind:value={props.poem}
				on:keyup={updateTextareaHeight}
				disabled={!editable}
				class="paper overflow-y-hidden resize-none rounded-none {$font} {$poemAlignment}"
				id="poem-textarea"
			/>
		</div>
	</div>
</div>
