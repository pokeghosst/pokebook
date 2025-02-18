<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { count } from 'letter-count';

	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';
	import { writingPadFontSize } from '$lib/stores/writingPadFontSize';

	import { t } from '$lib/translations';
	import { putSyllables } from '$lib/util/PokeHelp';

	export let props: { name: Writable<string>; body: Writable<string> };
	export let unsavedChangesHandler;

	let poemNameStoreProp = props.name;
	let poemBodyStoreProp = props.body;

	// Overlays
	let syllableRows: string;
	let stats: Record<string, string | number>;

	let lines: string[] = $poemBodyStoreProp.split('\n');

	let poemTextarea: HTMLTextAreaElement;

	$: lines = $poemBodyStoreProp.split('\n');
	$: $poemBodyStoreProp, autoResizeNotebook();

	// To avoid text going beyond the notepad when the poem is padded/un-padded
	$: $isPokehelpActive, autoResizeNotebook();

	$: if ($isPokehelpActive == 'true') $poemBodyStoreProp, updatePokeHelpOverlays();

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
		stats = count($poemBodyStoreProp);
		syllableRows = putSyllables(lines);
	}

	function sanitizePoemTitle() {
		const forbiddenChars = /[./_]/g;
		$poemNameStoreProp = $poemNameStoreProp.replace(forbiddenChars, '');
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
</script>

<div class="notebook" id="poem-notebook">
	<input
		class="notebook-header"
		bind:value={$poemNameStoreProp}
		on:input={sanitizePoemTitle}
		placeholder={$t('workspace.unnamed')}
		on:change|once={unsavedChangesHandler}
	/>
	<div class="notebook-inner-wrapper">
		{#if $isPokehelpActive === 'true'}
			<div class="poem-stats">
				{$t('workspace.words')}: {stats.words} | {$t('workspace.characters')}: {stats.chars} | {$t(
					'workspace.lines'
				)}: {stats.lines}
			</div>
			<div class="notebook-paper-overlay poem-syllable-rows" aria-hidden="true">
				{@html syllableRows}
			</div>
		{/if}
		<textarea
			bind:value={$poemBodyStoreProp}
			class="paper {$poemPadJustification} {$isPokehelpActive === 'true'
				? 'l-padded-for-pokehelp'
				: ''}"
			id="poem-textarea"
			style={`font-size: ${$writingPadFontSize}px`}
			bind:this={poemTextarea}
			on:change|once={unsavedChangesHandler}
		/>
	</div>
</div>
