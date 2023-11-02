<script lang="ts">
	import { Preferences } from '@capacitor/preferences';
	import Notes from '../components/Notes.svelte';
	import Poem from '../components/Poem.svelte';
	import { viewsState } from '../stores/views';
	import NotepadDropdownMenu from './NotepadDropdownMenu.svelte';
	import ArrowsSwap from './svg/ArrowsSwap.svelte';
	import ArrowsExpand from './svg/ArrowsExpand.svelte';
	import { onMount } from 'svelte';

	export let editable = true;
	export let actions;

	let isFullWidth: boolean;
	let state;

	let views = [Poem, Notes];

	onMount(async () => {
		state = JSON.parse($viewsState);
		isFullWidth = (await Preferences.get({ key: 'full_width_pad' })).value === 'true';
	});

	let currentState = 'transition-opacity duration-500 ease-out opacity-100';

	function swapViews() {
		currentState = 'transition-opacity duration-500 ease-out opacity-0';
		setTimeout(function () {
			[state[0], state[1]] = [state[1], state[0]];
			$viewsState = JSON.stringify(state);
			currentState = 'transition-opacity duration-500 ease-out opacity-100';
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
	<div class="workspace {isFullWidth ? 'l-full-width' : ''} {currentState}">
		<div class="workspace-pad">
			<div class="workspace-pad-toolbar">
				<div>
					<button on:click={expandPoemPad}><ArrowsExpand /></button>
					<button on:click={swapViews}><ArrowsSwap /></button>
					<NotepadDropdownMenu {actions} />
				</div>
			</div>
			<svelte:component this={views[state[0]]} bind:editable />
		</div>
		<div class="workspace-pad">
			<svelte:component this={views[state[1]]} bind:editable />
		</div>
	</div>
{/if}
