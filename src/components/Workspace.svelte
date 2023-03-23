<script>
	import { count, countFromFile, info } from 'letter-count';
	import Notes from '../components/Notes.svelte';
	import Poem from '../components/Poem.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faRightLeft } from '@fortawesome/free-solid-svg-icons';

    export let poemProps;
    export let noteProps;
    export let editable = true;

	let views = [Poem, Notes];
	let props = [poemProps, noteProps];
	let propPositions = [0, 1];

	$: poemProps.poem = props[propPositions[0]].poem;
	$: poemProps.poemName = props[propPositions[0]].poemName;
	$: noteProps.note = props[propPositions[1]].note

	let currentState = 'transition-opacity duration-500 ease-out opacity-100';

	function swapViews() {
		currentState = 'transition-opacity duration-500 ease-out opacity-0';
		setTimeout(function () {
			[views[0], views[1]] = [views[1], views[0]];
            [props[0], props[1]] = [props[1], props[0]];
            [propPositions[0], propPositions[1]] = [propPositions[1], propPositions[0]];
			currentState = 'transition-opacity duration-500 ease-out opacity-100';
		}, 600);
	}

</script>

<div class="notebook-container w-11/12 mb-40 md:columns-2 mx-auto mt-5 {currentState}">
	<div class="h-screen w-max md:w-full inline-block md:block">
		<div class="relative">
			<button class="absolute right-2 top-2 z-10" on:click={swapViews}
				><FontAwesomeIcon
					icon={faRightLeft}
					class="text-[#333333] border-[#333333] border-[1px] bg-white dark:bg-stone-200 p-2 rounded-full"
				/></button
			>
		</div>
		<svelte:component this={views[0]} bind:editable={editable} bind:props={props[0]} />
	</div>
	<div class="h-screen w-max md:w-full inline-block">
		<svelte:component this={views[1]} bind:editable={editable} bind:props={props[1]} />
	</div>
</div>
