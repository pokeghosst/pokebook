<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023, 2025 Pokeghost.

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
	import { onMount, getContext } from 'svelte';

	import { count } from 'letter-count';
	import { syllable } from 'syllable';
	import { t } from '$lib/translations';

	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';
	import { writingPadFontSize } from '$lib/stores/writingPadFontSize';

	let { poemProp }: { poemProp: { name: string; text: string } } = $props();
	let name = $state(poemProp.name);
	let text = $state(poemProp.text);

	const poemNameChangeHandler = getContext('poemNameChangeHandler') as (event: Event) => void
	const poemTextChangeHandler = getContext('poemTextChangeHandler') as (event: Event) => void

	let lines: string[] = $derived(text.split('\n'));
	let syllableCounts: number[] = $derived(lines.map((line) => syllable(line)))
	let stats: Record<string, string | number> = $derived(count(text));

	let poemTextarea: HTMLTextAreaElement;

	// $: $poemBodyStoreProp, autoResizeNotebook();

	// To avoid text going beyond the notepad when the poem is padded/un-padded
	// $: $isPokehelpActive, autoResizeNotebook();

	// $: if ($isPokehelpActive == 'true') $poemBodyStoreProp, updatePokeHelpOverlays();

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

{#snippet syllableLine(syllableCount: number, line: string)}
	<span class="poem-syllable-count">{syllableCount}</span>
	<span style="color: transparent; margin-left: 5px">${line}</span>
	<br/>
{/snippet}

<div class="notebook" id="poem-notebook">
	<input
		class="notebook-header"
		bind:value={name}
		oninput={poemNameChangeHandler}
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
				{#each lines as line, i}
					{@render syllableLine(syllableCounts[i], line)}
				{/each}
			</div>
		{/if}
		<textarea
			bind:value={text}
			oninput={poemTextChangeHandler}
			class="paper {$poemPadJustification} {$isPokehelpActive === 'true'
				? 'l-padded-for-pokehelp'
				: ''}"
			id="poem-textarea"
			style={`font-size: ${$writingPadFontSize}px`}
			bind:this={poemTextarea}
		></textarea>
	</div>
</div>
