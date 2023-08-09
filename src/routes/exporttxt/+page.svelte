<script>
	import { onMount } from 'svelte';
	import { db } from '../../stores/db';

	let poems = [];

	onMount(async () => {
		await db.poems
			.reverse()
			.toArray()
			.then((objects) => {
				poems = objects;
			})
			.catch((error) => {
				console.error(error);
			});
	});

	function exportToFile(poem) {
		const poemBlob = new Blob([poem.poem], { type: 'text/plain' });
        const poemUrl = URL.createObjectURL(poemBlob);
        const poemA = document.createElement("a");
        poemA.href = poemUrl;
        poemA.download = `${poem.name}_${poem.timestamp}.txt`;
        poemA.click();
        URL.revokeObjectURL(poemUrl);

        const noteBlob = new Blob([poem.note], { type: 'text/plain' });
        const noteUrl = URL.createObjectURL(noteBlob);
        const noteA = document.createElement("a");
        noteA.href = noteUrl;
        noteA.download = `${poem.name}_note_${poem.timestamp}.txt`;
        noteA.click();
        URL.revokeObjectURL(noteUrl);
	}

	function exportPoems() {
		poems.forEach((poem) => exportToFile(poem));
	}
</script>

<p class="m-5">Each poem and note will be exported to individual .txt file.</p>

{#if poems}
	<button on:click={exportPoems} class="underline italic m-5">EXPORT POEMS TO TXT FILES</button>
{/if}
