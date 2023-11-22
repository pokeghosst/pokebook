<script lang="ts">
	import { CountOption, count } from 'letter-count';
	import { Preferences } from '@capacitor/preferences';
	import { onMount } from 'svelte';
	import { isPokehelpActive } from '../lib/stores/pokehelpMode';
	import type { Writable } from 'svelte/store';
	import { t } from '$lib/translations';
	import { putSyllables, highlightWords } from '$lib/pokehelp-util';
	import { poemPadJustification } from '../lib/stores/poemPadJustification';

	export let editable: boolean;
	export let props: { name: Writable<string>; body: Writable<string> };

	let poemNameStoreProp = props.name;
	let poemBodyStoreProp = props.body;

	// Overlays
	let highlightedWords: string[];
	let syllableRows: string;
	let stats: Record<string, string | number>;

	let lines: string[] = $poemBodyStoreProp.split('\n');

	let poemTextarea: HTMLTextAreaElement;
	let poemOverlay: Element;

	$: lines = $poemBodyStoreProp.split('\n');
	$: $poemBodyStoreProp, autoResizeNotebook();

	// To avoid text going beyond the notepad when the poem is padded/un-padded
	$: $isPokehelpActive, autoResizeNotebook();

	$: if ($isPokehelpActive == 'true') $poemBodyStoreProp, updatePokeHelpOverlays();

	onMount(async () => {
		requestAnimationFrame(() => {
			autoResizeNotebook();
		});

		// Resize the notebook when switching between single/dual panes
		const resizeObserver = new ResizeObserver(autoResizeNotebook);
		resizeObserver.observe(poemTextarea);

		return () => {
			resizeObserver.unobserve(poemTextarea);
			resizeObserver.disconnect();
		};
	});

	function updatePokeHelpOverlays() {
		stats = count(CountOption['--all'], $poemBodyStoreProp);
		syllableRows = putSyllables(lines);
		highlightedWords = highlightWords($poemBodyStoreProp, lines);
	}

	function sanitizePoemTitle() {
		const forbiddenChars = /[./_]/g;
		$poemNameStoreProp = $poemNameStoreProp.replace(forbiddenChars, '');
	}

	async function autoResizeNotebook() {
		requestAnimationFrame(() => {
			if (poemTextarea !== null) {
				const scrollPosition = window.scrollY;
				poemTextarea.style.height = 'auto';
				poemTextarea.style.height = `${poemTextarea.scrollHeight}px`;
				window.scrollTo(0, scrollPosition);
			}
		});
	}
</script>

<div class="notebook" id="poem-notebook">
	<input
		class="notebook-header"
		disabled={!editable}
		bind:value={$poemNameStoreProp}
		on:input={sanitizePoemTitle}
	/>
	<div class="notebook-inner-wrapper">
		<div class="relative">
			{#if $isPokehelpActive == 'true'}
				<div class="poem-stats">
					{$t('workspace.words')}: {stats.words} | {$t('workspace.characters')}: {stats.chars} | {$t(
						'workspace.lines'
					)}: {stats.lines}
				</div>
				<div
					class="notebook-paper-overlay paper-highlight-overlay {$poemPadJustification}"
					aria-hidden="true"
					bind:this={poemOverlay}
				>
					{@html highlightedWords}
				</div>
				<div class="notebook-paper-overlay poem-syllable-rows" aria-hidden="true">
					{@html syllableRows}
				</div>
			{/if}
			<textarea
				bind:value={$poemBodyStoreProp}
				disabled={!editable}
				class="paper {$poemPadJustification} {$isPokehelpActive == 'true'
					? 'l-padded-for-pokehelp'
					: ''}"
				id="poem-textarea"
				bind:this={poemTextarea}
			/>
		</div>
	</div>
</div>
