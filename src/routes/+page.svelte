<script>
	import Workspace from '../components/Workspace.svelte';
	import { poemStorage, poemNameStorage, noteStorage } from '../stores/poemStore.js';

	let poemProps = {
		poem: $poemStorage,
		poemName: $poemNameStorage
	};

	let noteProps = {
		note: $noteStorage
	};

	$: $poemStorage = poemProps.poem;
	$: $poemNameStorage = poemProps.poemName;
	$: $noteStorage = noteProps.note;
	
</script>

<Workspace bind:poemProps bind:noteProps />
