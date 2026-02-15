<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023, 2026 Pokeghost.

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
-->

<script lang="ts">
	import type { OnlyPoem } from '$lib/schema/poem.schema';
	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';
	import { writingPadFontSize } from '$lib/stores/writingPadFontSize';
	import { t } from '$lib/translations';
	import type { InputChangeEvent, InputChangeHandler } from '$lib/types';
	import { count } from 'letter-count';
	import { getContext, onMount } from 'svelte';
	import { syllable } from 'syllable';

	let poem = getContext<OnlyPoem>('poem');
	const [handleNameChange, handleTextChange] =
		getContext<[InputChangeHandler<HTMLInputElement>, InputChangeHandler<HTMLTextAreaElement>]>(
			'poemHandlers'
		);

	let lines = $derived(poem.text.split('\n'));
	// Overlays
	let stats: Record<string, string | number> = $derived(count(poem.text));
	let syllableCounts: number[] = $derived(lines.map((line) => syllable(line)));

	let poemTextarea: HTMLTextAreaElement;

	$effect(() => {
		(poem.name, autoResizeNotebook());
	});

	$effect(() => {
		(poem.text, autoResizeNotebook());
	});

	onMount(() => {
		// Resize the notebook when switching between single/dual panes
		const resizeObserver = new ResizeObserver(autoResizeNotebook);
		resizeObserver.observe(poemTextarea);

		return () => {
			resizeObserver.unobserve(poemTextarea);
			resizeObserver.disconnect();
		};
	});

	async function autoResizeNotebook() {
		/*
			Requesting the animation frame twice is the most reliable way to
			have correct auto resizing even on long text in MOST cases
		*/
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (poemTextarea) {
					const scrollPosition = window.scrollY;
					poemTextarea.style.height = 'auto';
					poemTextarea.style.height = `${poemTextarea.scrollHeight}px`;
					window.scrollTo(0, scrollPosition);
				}
			});
		});
	}

	function sanitizeTitle(e: InputChangeEvent<HTMLInputElement>) {
		e.currentTarget.value = e.currentTarget.value.replace(/[./_]/g, '');

		console.log('sanitized value ', e.currentTarget.value);

		return e;
	}
</script>

{#snippet syllableLine(syllableCount: number, line: string)}
	<span class="poem-syllable-count">{syllableCount}</span>
	<span style="color: transparent; margin-left: 5px">${line}</span>
	<br />
{/snippet}

<div class="notebook" id="poem-notebook">
	<input
		class="notebook-header"
		value={poem.name}
		onbeforeinput={sanitizeTitle}
		oninput={(e) => {
			handleNameChange(sanitizeTitle(e));
		}}
		placeholder={$t('workspace.unnamed')}
	/>
	<div class="notebook-inner-wrapper">
		{#if $isPokehelpActive === 'true'}
			<div class="poem-stats">
				{$t('workspace.words')}: {stats.words} | {$t('workspace.characters')}: {stats.chars} | {$t(
					'workspace.lines'
				)}: {stats.lines}
			</div>
			<div class="notebook-paper-overlay poem-syllable-rows" aria-hidden="true">
				{#each lines as line, i (`syllable-line-${i}`)}
					{@render syllableLine(syllableCounts[i], line)}
				{/each}
			</div>
		{/if}
		<textarea
			value={poem.text}
			oninput={handleTextChange}
			class="paper {$poemPadJustification} {$isPokehelpActive === 'true'
				? 'l-padded-for-pokehelp'
				: ''}"
			id="poem-textarea"
			style={`font-size: ${$writingPadFontSize}px`}
			bind:this={poemTextarea}
		></textarea>
	</div>
</div>
