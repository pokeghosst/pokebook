<script>
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { db } from '../../../stores/db';

	let response;
	export let note;
	export let poem;
	export let poemName;
	export let data;
	let nameEl;
	let editMode;

	onMount(async () => {
		load();
		editMode = false;
	});

	function toggleEdit() {
		editMode = !editMode;
	}

	async function load() {
		response = await db.poems.get({ id: Number(data.id) });
		note = response.note;
		poem = response.poem;
		poemName = response.name;
	}

	async function save() {
		await db.poems.where('id').equals(Number(data.id)).modify({
			note: note,
			poem: poem,
			name: nameEl.innerText
		});
		toggleEdit();
	}

	async function deletePoem() {
		db.poems.where('id').equals(Number(data.id)).delete();
		window.location.replace('/stash');
	}
</script>

<div class="w-11/12 pt-5 md:pt-0 text-center md:text-right mx-auto">
	{#if !editMode}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block"
			on:click={toggleEdit}>Edit</button
		>
	{:else}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block"
			on:click={save}>Save</button
		>
	{/if}

	<button
		on:click={() => deletePoem()}
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block"
		>Delete poem</button
	>
</div>
<div class="notebook-container w-11/12 h-screen columns-2 mx-auto mt-5">
	<div class="notebook h-full">
		<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
		<div class="w-full h-5/6">
			<textarea
				bind:value={note}
				class="paper whitespace-pre-line h-fit mb-10 min-h-full"
				disabled={!editMode}
			/>
		</div>
	</div>
	<div class="notebook h-full">
		<div
			bind:this={nameEl}
			class="top text-white leading-[50px] pl-5 font-bold overflow-scroll"
			disabled={!editMode}
		>
			{poemName}
		</div>
		<div class="w-full h-5/6">
			<textarea
				bind:value={poem}
				class="paper whitespace-pre-line h-fit mb-10 min-h-full"
				disabled={!editMode}
			/>
		</div>
	</div>
</div>
