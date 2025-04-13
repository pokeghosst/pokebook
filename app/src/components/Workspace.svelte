<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2025 Pokeghost.

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
	import { onDestroy, onMount } from 'svelte';

	import appState from '$lib/AppState.svelte';
	import hotkeys from 'hotkeys-js';

	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import ChevronsLeftRight from 'lucide-svelte/icons/chevrons-left-right';

	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';
	import Toolbar from './Toolbar.svelte';

	import type { ToolbarItem } from '$lib/types';
	import type { Poem } from '@pokebook/shared';

	let {
		poem = $bindable(),
		note = $bindable(),
		toolbarActions
	}: {
		poem: Omit<Poem, 'note'>;
		note: Pick<Poem, 'note'>;
		toolbarActions: ToolbarItem[];
	} = $props();

	onMount(() => {
		hotkeys('ctrl+e, command+e', function () {
			expandPoemPad();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+e, command+e');
	});

	function swapViews() {
		[appState.value.padPositions[0], appState.value.padPositions[1]] = [
			appState.value.padPositions[1],
			appState.value.padPositions[0]
		];
	}

	function expandPoemPad() {
		appState.value.padFullWidth = !appState.value.padFullWidth;
	}
</script>

{#snippet pad(state: string)}
	{#if state === 'poem'}
		<PoemPad bind:poemProp={poem} />
	{:else if state === 'note'}
		<NotePad bind:noteProp={note} />
	{:else}
		D'oh!
	{/if}
{/snippet}

<div class="toolbar"><Toolbar actions={toolbarActions} /></div>
<div
	class="workspace {appState.value.padFullWidth ? 'l-full-width' : ''} {appState.value
		.writingPadFont}"
>
	<div class="notebook-container">
		<div class="notebook-container-toolbar">
			<div>
				<button onclick={expandPoemPad}>
					<ChevronsLeftRight class="round-button" />
				</button>
				<button onclick={swapViews}>
					<ArrowRightLeft class="round-button" />
				</button>
			</div>
		</div>
		{@render pad(appState.value.padPositions[0])}
	</div>
	<div class="notebook-container">
		{@render pad(appState.value.padPositions[1])}
	</div>
</div>
