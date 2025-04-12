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

	import { isFullWidthPad } from '$lib/stores/isFullWidthPad';
	import { viewsState } from '$lib/stores/views';
	import { writingPadFont } from '$lib/stores/writingPadFont';
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

	let padView = $state(['poem', 'note']);
	let currentState = $state('');

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
		currentState = 'transitioning';
		setTimeout(function () {
			[padView[0], padView[1]] = [padView[1], padView[0]];
			$viewsState = JSON.stringify(padView);
			currentState = '';
		}, 600);
	}

	function expandPoemPad() {
		// $isFullWidthPad === 'true' ? ($isFullWidthPad = 'false') : ($isFullWidthPad = 'true');
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
	class="workspace {$isFullWidthPad === 'true'
		? 'l-full-width'
		: ''} {currentState} {$writingPadFont}"
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
		{@render pad(padView[0])}
	</div>
	<div class="notebook-container">
		{@render pad(padView[1])}
	</div>
</div>
