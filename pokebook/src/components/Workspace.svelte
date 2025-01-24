<!-- @migration-task Error while migrating Svelte code: can't migrate `let state: number[] = JSON.parse($viewsState);` to `$state` because there's a variable named state.
     Rename the variable and try again or migrate by hand. -->
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
	import { onDestroy, onMount, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';

	import hotkeys from 'hotkeys-js';

	import {
		isFullWidthPad,
		notebookFont,
		writingPadsState
	} from '$lib/plugins/UserPreferenceFactory.svelte';
	import { viewsState } from '$lib/stores/views';
	import { writingPadFont } from '$lib/stores/writingPadFont';

	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';

	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import ChevronsLeftRight from 'lucide-svelte/icons/chevrons-left-right';
	import Toolbar from './Toolbar.svelte';
	import type { WorkspaceProps } from '$lib/types';

	// export let actions: { icon: ComponentType; action: () => void; label: string }[];
	// export let poemProps: { name: Writable<string>; body: Writable<string> };
	// export let noteProps: Writable<string>;

	let { poemProp = $bindable(), noteProp }: WorkspaceProps = $props();


	// Assigning empty function by default because on draft page we don't pass a function here
	// export let unsavedChangesHandler = () => {};

	// let padsState: number[] = JSON.parse($viewsState);
	// let views = [PoemPad, NotePad];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// let props: [any, any] = [poemProps, noteProps];

	// let currentState = $state('');

	// onMount(() => {
	// 	hotkeys('ctrl+e, command+e', function () {
	// 		expandPoemPad();
	// 		return false;
	// 	});
	// });

	// onDestroy(() => {
	// 	hotkeys.unbind('ctrl+e, command+e');
	// });

	function swapViews() {
		// currentState = 'transitioning';
		setTimeout(function () {
			const state = writingPadsState.value;
			[state[0], state[1]] = [state[1], state[0]];
			writingPadsState.value = state;
			// currentState = '';
		}, 300);
	}

	function expandPoemPad() {
		isFullWidthPad.value = !isFullWidthPad.value;
	}
</script>

{#snippet pad(state: string)}
	{#if state === 'poem'}
		<PoemPad bind:poemProp={poemProp} />
	{:else if state === 'note'}
		<NotePad {noteProp} />
	{:else}
		D'oh!
	{/if}
{/snippet}

<!-- <div class="toolbar"><Toolbar {actions} /></div> -->
<div class="workspace {isFullWidthPad.value ? 'l-full-width' : ''} {notebookFont.value}">
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
		{@render pad(writingPadsState.value[0])}
	</div>
	<div class="notebook-container">
		{@render pad(writingPadsState.value[1])}
	</div>
</div>

<!-- {#if state}
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
						<ChevronsLeftRight class="round-button" />
					</button>
					<button on:click={swapViews}>
						<ArrowRightLeft class="round-button" />
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
{/if} -->

