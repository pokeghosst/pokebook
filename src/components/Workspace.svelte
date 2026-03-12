<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

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
	import { isFullWidthPad } from '$lib/stores/isFullWidthPad';
	import { viewsState } from '$lib/stores/views';
	import { writingPadFont } from '$lib/stores/writingPadFont';
	import hotkeys from 'hotkeys-js';
	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import ChevronsLeftRight from 'lucide-svelte/icons/chevrons-left-right';
	import { onDestroy, onMount, type ComponentType } from 'svelte';
	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';
	import Toolbar from './Toolbar.svelte';

	let {
		actions
	}: {
		actions: { icon: ComponentType; action: () => void; label: string }[];
	} = $props();

	let padState: number[] = $state(JSON.parse($viewsState));
	let views = ['poem', 'note'];

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
			[padState[0], padState[1]] = [padState[1], padState[0]];
			$viewsState = JSON.stringify(padState);
			currentState = '';
		}, 300);
	}

	function expandPoemPad() {
		$isFullWidthPad === 'true' ? ($isFullWidthPad = 'false') : ($isFullWidthPad = 'true');
	}
</script>

{#snippet pad(state: string)}
	{#if state === 'poem'}
		<PoemPad />
	{:else if state === 'note'}
		<NotePad />
	{:else}
		D'oh!
	{/if}
{/snippet}

<div class="toolbar"><Toolbar {actions} /></div>
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
		{@render pad(views[padState[0]])}
	</div>
	<div class="notebook-container">
		{@render pad(views[padState[1]])}
	</div>
</div>
