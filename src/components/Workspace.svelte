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
	import { onDestroy, onMount, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';

	import hotkeys from 'hotkeys-js';

	import { isFullWidthPad } from '$lib/stores/isFullWidthPad';
	import { viewsState } from '$lib/stores/views';
	import { writingPadFont } from '$lib/stores/writingPadFont';

	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';

	import ArrowsExpand from './svg/ArrowsExpand.svelte';
	import ArrowsSwap from './svg/ArrowsSwap.svelte';
	import Toolbar from './Toolbar.svelte';

	export let actions: { icon: ComponentType; action: () => void; label: string }[];
	export let poemProps: { name: Writable<string>; body: Writable<string> };
	export let noteProps: Writable<string>;

	// Assigning empty function by default because on draft page we don't pass a function here
	export let unsavedChangesHandler = () => {};

	let state: number[] = JSON.parse($viewsState);
	let views = [PoemPad, NotePad];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let props: [any, any] = [poemProps, noteProps];

	let currentState = '';

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
			[state[0], state[1]] = [state[1], state[0]];
			$viewsState = JSON.stringify(state);
			currentState = '';
		}, 600);
	}

	function expandPoemPad() {
		$isFullWidthPad === 'true' ? ($isFullWidthPad = 'false') : ($isFullWidthPad = 'true');
	}
</script>

{#if state}
	<div class="toolbar"><Toolbar {actions} /></div>
	<div
		class="workspace {$isFullWidthPad === 'true'
			? 'l-full-width'
			: ''} {currentState} {$writingPadFont}"
	>
		<div class="notebook-container">
			<div class="notebook-container-toolbar">
				<div>
					<button on:click={expandPoemPad}>
						<ArrowsExpand />
					</button>
					<button on:click={swapViews}>
						<ArrowsSwap />
					</button>
				</div>
			</div>
			<svelte:component
				this={views[state[0]]}
				{unsavedChangesHandler}
				bind:props={props[state[0]]}
			/>
		</div>
		<div class="notebook-container">
			<svelte:component
				this={views[state[1]]}
				{unsavedChangesHandler}
				bind:props={props[state[1]]}
			/>
		</div>
	</div>
{/if}
