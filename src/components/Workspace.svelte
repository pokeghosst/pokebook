<script>
	import { count, countFromFile, info } from 'letter-count';
	import Notes from '../components/Notes.svelte';
	import Poem from '../components/Poem.svelte';
	import { viewsState } from '../stores/views';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faRightLeft } from '@fortawesome/free-solid-svg-icons';

    export let poemProps;
    export let noteProps;
    export let editable = true;

	let views = [Poem, Notes];
	let props = [poemProps, noteProps];

	let state = JSON.parse($viewsState)
	console.log(state)

	$: poemProps.poem = props[0].poem;
	$: poemProps.poemName = props[0].poemName;
	$: noteProps.note = props[1].note

	let currentState = 'transition-opacity duration-500 ease-out opacity-100';

	function swapViews() {
		currentState = 'transition-opacity duration-500 ease-out opacity-0';
		setTimeout(function () {
            [state[0], state[1]] = [state[1], state[0]];
			$viewsState = JSON.stringify(state)
			currentState = 'transition-opacity duration-500 ease-out opacity-100';
		}, 600);
	}

</script>

<div class="notebook-container w-11/12 mb-40 md:columns-2 mx-auto mt-5 {currentState}">
	<div class="h-screen w-max md:w-full inline-block">
		<div class="relative">
			<button class="absolute right-2 top-2 z-10" id="swap" on:click={swapViews}
				><FontAwesomeIcon
					icon={faRightLeft}
					class="text-[#333333] border-[#333333] border-[1px] bg-white p-2 rounded-full"
				/></button
			>
		</div>
		<svelte:component this={views[state[0]]} bind:editable={editable} bind:props={props[state[0]]} />
	</div>
	<div class="h-screen w-max md:w-full inline-block">
		<svelte:component this={views[state[1]]} bind:editable={editable} bind:props={props[state[1]]} />
	</div>
</div>
