<script lang="ts">
	import { onMount } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';
	import ArrowsSwap from './svg/ArrowsSwap.svelte';
	import ArrowsExpand from './svg/ArrowsExpand.svelte';
	import PadDropdownMenu from './PadDropdownMenu.svelte';
	import { viewsState } from '../lib/stores/views';
	import type { Writable } from 'svelte/store';

	export let poemProps: { name: Writable<string>; body: Writable<string> };
	export let noteProps: Writable<string>;
	export let actions: { action: Function; label: string }[];
	export let editable = true;

	let isFullWidth: boolean;
	let state: number[];
	let views = [PoemPad, NotePad];
	let props: any = [poemProps, noteProps];
	let font: string;

	let currentState = '';

	onMount(async () => {
		state = JSON.parse($viewsState);
		isFullWidth = (await Preferences.get({ key: 'full_width_pad' })).value === 'true';
		font = (await Preferences.get({ key: 'notebook_font' })).value || 'halogen';
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
		isFullWidth = !isFullWidth;
		Preferences.set({
			key: 'full_width_pad',
			value: isFullWidth.toString()
		});
	}
</script>

{#if state}
	<div class="workspace {isFullWidth ? 'l-full-width' : ''} {currentState} {font}">
		<div class="notebook-container">
			<div class="notebook-container-toolbar">
				<div>
					<button on:click={expandPoemPad}><ArrowsExpand /></button>
					<button on:click={swapViews}><ArrowsSwap /></button>
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
