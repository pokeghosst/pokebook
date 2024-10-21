<!--
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
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { writingPadFontSize } from '$lib/stores/writingPadFontSize';

	import { t } from '$lib/translations';

	let { note } = $props();

	// export let props: Writable<string>;
	// export let unsavedChangesHandler;

	// let lines = $props.split('\n');
	let noteTextarea: HTMLTextAreaElement;

	onMount(() => {
		// Resize the notebook when switching between single/dual panes
		const resizeObserver = new ResizeObserver(autoResizeNotebook);
		resizeObserver.observe(noteTextarea);

		return () => {
			resizeObserver.unobserve(noteTextarea);
			resizeObserver.disconnect();
		};
	});

	// $: lines = $props.split('\n');
	// $: lines, autoResizeNotebook();

	async function autoResizeNotebook() {
		// Requesting the animation frame twice is the most reliable way to
		// have correct auto resizing even on long text in MOST cases
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (noteTextarea) {
					const scrollPosition = window.scrollY;
					noteTextarea.style.height = 'auto';
					noteTextarea.style.height = `${noteTextarea.scrollHeight}px`;
					window.scrollTo(0, scrollPosition);
				}
			});
		});
	}
</script>

<div class="notebook">
	<div class="notebook-header">{$t('workspace.note')}</div>
	<div>
		<textarea
			bind:value={note.value}
			class="paper"
			id="note-textarea"
			style={`font-size: ${$writingPadFontSize}px`}
			bind:this={noteTextarea}
		></textarea>
	</div>
</div>
