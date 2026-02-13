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
	import { run } from 'svelte/legacy';

	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';
	import { writingPadFontSize } from '$lib/stores/writingPadFontSize';
	import { t } from '$lib/translations';
	import type { InputChangeHandler } from '$lib/types';
	import { putSyllables } from '$lib/util/PokeHelp';
	import { count } from 'letter-count';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	const { name, text } = getContext<{ name: Writable<string>; text: Writable<string> }>('poem');
	const [poemNameHandler, poemTextHandler] =
		getContext<[InputChangeHandler<HTMLInputElement>, InputChangeHandler<HTMLTextAreaElement>]>(
			'poemHandlers'
		);

	// Overlays
	let syllableRows: string = $state();
	let stats: Record<string, string | number> = $state();

	let poemTextarea: HTMLTextAreaElement = $state();

	onMount(() => {
		// Resize the notebook when switching between single/dual panes
		const resizeObserver = new ResizeObserver(autoResizeNotebook);
		resizeObserver.observe(poemTextarea);

		return () => {
			resizeObserver.unobserve(poemTextarea);
			resizeObserver.disconnect();
		};
	});

	function updatePokeHelpOverlays() {
		stats = count($text);
		syllableRows = putSyllables(lines);
	}

	async function autoResizeNotebook() {
		// Requesting the animation frame twice is the most reliable way to
		// have correct auto resizing even on long text in MOST cases
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
	let lines = $derived($text.split('\n'));
	run(() => {
		($text, autoResizeNotebook());
	});
	// To avoid text going beyond the notepad when the poem is padded/un-padded
	run(() => {
		($isPokehelpActive, autoResizeNotebook());
	});
	run(() => {
		if ($isPokehelpActive == 'true') ($text, updatePokeHelpOverlays());
	});
</script>

<div class="notebook" id="poem-notebook">
	<input
		class="notebook-header"
		bind:value={$name}
		oninput={poemNameHandler}
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
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html syllableRows}
			</div>
		{/if}
		<textarea
			bind:value={$text}
			oninput={poemTextHandler}
			class="paper {$poemPadJustification} {$isPokehelpActive === 'true'
				? 'l-padded-for-pokehelp'
				: ''}"
			id="poem-textarea"
			style={`font-size: ${$writingPadFontSize}px`}
			bind:this={poemTextarea}
		></textarea>
	</div>
</div>
