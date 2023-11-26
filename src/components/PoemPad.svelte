<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { count } from 'letter-count';

	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';

	import { highlightWords, putSyllables } from '$lib/pokehelp-util';
	import { t } from '$lib/translations';

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
		highlightedWords = highlightWords($poemBodyStoreProp, lines);
	}

	function sanitizePoemTitle() {
		const forbiddenChars = /[./_]/g;
		$poemNameStoreProp = $poemNameStoreProp.replace(forbiddenChars, '');
	}

	async function autoResizeNotebook() {
		if (poemTextarea) {
			// Requesting the animation frame twice is the most reliable way to
			// have correct auto resizing even on long text in MOST cases
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const scrollPosition = window.scrollY;
					poemTextarea.style.height = 'auto';
					poemTextarea.style.height = `${poemTextarea.scrollHeight}px`;
					window.scrollTo(0, scrollPosition);
				});
			});
		}
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
		{#if $isPokehelpActive === 'true'}
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
			class="paper {$poemPadJustification} {$isPokehelpActive === 'true'
				? 'l-padded-for-pokehelp'
				: ''}"
			id="poem-textarea"
			bind:this={poemTextarea}
		/>
	</div>
</div>
