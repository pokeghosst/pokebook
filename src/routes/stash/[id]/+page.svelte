<script>
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { db } from '../../../stores/db';

	let response;
	export let text;
	export let data;
	export let editMode = false;
	let editablePoem;
	// Are we editing a poem or not(e)?
	export let poemMode = true;

	onMount(async () => {
		loadPoem();
	});

	async function loadPoem() {
		response = await db.poems.get({ id: Number(data.id) });
		text = response.poem;
		poemMode = true;
	}

	async function loadNotes() {
		response = await db.poems.get({ id: Number(data.id) });
		text = response.note;
		poemMode = false;
	}

	// Probably not the best way...
	async function save() {
		text = editablePoem.textContent;
		if (poemMode) {
			console.log(text);
			db.poems.where('id').equals(Number(data.id)).modify({ poem: text });
		} else {
			db.poems.where('id').equals(Number(data.id)).modify({ note: text });
		}
		editMode = false;
	}

	async function deletePoem() {
		db.poems.where('id').equals(Number(data.id)).delete();
		window.location.replace('/stash');
	}
</script>

<div class="w-6/12 h-screen mx-auto mt-5 relative">
	<div class="top">
		{#if editMode}
			<button
				class="cursor-pointer underline decoration-dotted hover:no-underline block float-right text-white leading-[50px] mr-5"
				on:click={() => save()}>Save</button
			>
		{/if}
	</div>
	<div class="w-full h-5/6">
		<div bind:this={editablePoem} class="paper whitespace-pre-line h-fit mb-10 min-h-full" contenteditable={editMode}>
			{text}
		</div>
	</div>
	<div class="absolute top-0 -right-[7em]">
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline block"
			on:click={() => loadPoem()}
			disabled={editMode}>Poem</button
		>
		<button
			class="mb-5 cursor-pointer underline decoration-dotted hover:no-underline block"
			on:click={() => loadNotes()}
			disabled={editMode}>Poem notes</button
		>
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline block"
			on:click={() => (editMode = true)}>Edit</button
		>
		<button
			on:click={() => deletePoem()}
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline block"
			>Delete poem</button
		>
	</div>
</div>
