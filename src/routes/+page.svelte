<script>
	import { count, countFromFile, info } from 'letter-count';
	import Notes from '../components/Notes.svelte';
	import Poem from '../components/Poem.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faRightLeft } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { darkMode } from '../stores/mode';

	let views = [Poem, Notes];
	let currentState = 'transition-opacity duration-500 ease-out opacity-100';

	function swapViews() {
		currentState = 'transition-opacity duration-500 ease-out opacity-0';
		setTimeout(function () {
			[views[0], views[1]] = [views[1], views[0]];
			currentState = 'transition-opacity duration-500 ease-out opacity-100';
		}, 600);
	}

	onMount(async () => {
		if ($darkMode) {
			document.documentElement.classList.add($darkMode);
		}
	});
</script>

<div class="notebook-container w-11/12 mb-40 md:columns-2 mx-auto mt-5 {currentState}">
	<div class="h-screen w-max md:w-full inline-block">
		<div class="relative">
			<button class="absolute right-2 top-2 z-10" on:click={swapViews}
				><FontAwesomeIcon
					icon={faRightLeft}
					class="text-[#333333] border-[#333333] border-[1px] bg-white p-2 rounded-full"
				/></button
			>
		</div>
		<svelte:component this={views[0]} />
	</div>
	<div class="h-screen w-max md:w-full inline-block">
		<svelte:component this={views[1]} />
	</div>
</div>
