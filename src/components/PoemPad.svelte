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
	import { justification, pokehelp } from '$lib/state.svelte';
	import { t } from '$lib/translations';
	import type { InputChangeEvent, InputChangeHandler } from '$lib/types';
	import { getContext, onMount } from 'svelte';

	let poem = getContext<OnlyPoem>('poem');
	const [handleNameChange, handleTextChange] =
		getContext<[InputChangeHandler<HTMLInputElement>, InputChangeHandler<HTMLTextAreaElement>]>(
			'poemHandlers'
		);

	let syllable = $state<((value: string) => number) | null>(null);

	let lines = $derived(poem.text.split('\n'));
	// Overlays
	let stats: Record<string, string | number> = $derived(countStats(poem.text));
	let syllableCounts: number[] = $derived(
		syllable && pokehelp.value ? lines.map((line) => syllable!(line)) : []
	);

	$effect(() => {
		if (pokehelp.value && !syllable) {
			import('syllable').then(({ syllable: _syllable }) => {
				syllable = _syllable;
			});
		}
	});

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

		return e;
	}

	function countStats(input: string) {
		const chars = input.length;
		const lines = input.split('\n').length;
		const words = input.trim() ? input.trim().split(/\s+/).length : 0;

		return { chars, lines, words };
	}
</script>

<div class="notebook" id="poem-notebook">
	<div class="notebook-header">
		<input
			value={poem.name}
			onbeforeinput={sanitizeTitle}
			oninput={(e) => {
				handleNameChange(sanitizeTitle(e));
			}}
			placeholder={$t('workspace.unnamed')}
		/>
		<div class="poem-metrics">{stats.lines} lines</div>
	</div>
	<textarea
		value={poem.text}
		oninput={handleTextChange}
		class="paper {justification.value}"
		id="poem-textarea"
		bind:this={poemTextarea}></textarea>
	<!-- <div class="shadow"></div> -->
</div>
