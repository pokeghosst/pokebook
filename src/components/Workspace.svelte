<script>
	import Notes from '../components/Notes.svelte';
	import Poem from '../components/Poem.svelte';
	import { viewsState } from '../stores/views';
	import NotepadDropdownMenu from './NotepadDropdownMenu.svelte';
	import ArrowsSwap from './svg/ArrowsSwap.svelte';
	import ArrowsExpand from './svg/ArrowsExpand.svelte';
	import { onMount } from 'svelte';

	export let editable = true;
	export let actions;

	let isHiddenClass = '';
	let isGrid = 'md:grid';
	let activePadWidth = 'w-[87vw]';

	let views = [Poem, Notes];

	let state;

	onMount(async () => {
		state = JSON.parse($viewsState);
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
		isHiddenClass == 'hidden' ? (isHiddenClass = '') : (isHiddenClass = 'hidden');
		isGrid == 'md:grid' ? (isGrid = '') : (isGrid = 'md:grid');
		activePadWidth == 'w-[87vw]' ? (activePadWidth = 'w-full') : (activePadWidth = 'w-[87vw]');
	}
</script>

{#if state}
	<div
		class="notebook-container w-11/12 mb-20 {isGrid} md:grid-cols-2 md:gap-4 mx-auto mt-5 {currentState}"
	>
		<div class="{activePadWidth} md:w-full md:col-span-1 mb-6 inline-block align-top relative">
			<div class="absolute right-2 top-2 z-10">
				<div class="flex">
					<button class="mr-1" on:click={expandPoemPad}><ArrowsExpand /></button>
					<button class="mr-1" on:click={swapViews}><ArrowsSwap /></button>
					<NotepadDropdownMenu {actions} />
				</div>
			</div>
			<svelte:component this={views[state[0]]} bind:editable />
		</div>
		<div class="w-[87vw] md:w-full mb-6 md:col-span-1 inline-block align-top {isHiddenClass}">
			<svelte:component this={views[state[1]]} bind:editable />
		</div>
	</div>
{/if}
