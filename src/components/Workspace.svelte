<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { isFullWidthPad } from '$lib/stores/isFullWidthPad';
	import { viewsState } from '$lib/stores/views';
	import { writingPadFont } from '$lib/stores/writingPadFont';

	import NotePad from './NotePad.svelte';
	import PadDropdownMenu from './PadDropdownMenu.svelte';
	import PoemPad from './PoemPad.svelte';

	import ArrowsExpand from './svg/ArrowsExpand.svelte';
	import ArrowsSwap from './svg/ArrowsSwap.svelte';

	export let editable = true;
	export let actions: { action: () => void; label: string }[];
	export let poemProps: { name: Writable<string>; body: Writable<string> };
	export let noteProps: Writable<string>;

	let state: number[] = JSON.parse($viewsState);
	let views = [PoemPad, NotePad];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let props: [any, any] = [poemProps, noteProps];

	let currentState = '';

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
					<PadDropdownMenu {actions} />
				</div>
			</div>
			<svelte:component this={views[state[0]]} {editable} bind:props={props[state[0]]} />
		</div>
		<div class="notebook-container">
			<svelte:component this={views[state[1]]} {editable} bind:props={props[state[1]]} />
		</div>
	</div>
{/if}
