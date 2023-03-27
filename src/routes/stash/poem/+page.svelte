<script>
	import { onMount } from 'svelte';
	import { db } from '../../../stores/db';
	import { currentPoem } from '../../../stores/poemId';
	import { goto } from '$app/navigation';
	import Workspace from '../../../components/Workspace.svelte';
	import generateImage from '../../../util/poem2image'

	let response;
	let editMode;

	let poemProps;
	let noteProps;

	let loaded = false;

	onMount(async () => {
		await load();
		editMode = false;
		loaded = true;
	});

	function toggleEdit() {
		editMode = !editMode;
	}

	async function load() {
		response = await db.poems.get({ id: Number($currentPoem) });
		poemProps = {
			poem: response.poem,
			poemName: response.name
		};

		noteProps = {
			note: response.note
		};
	}

	async function save() {
		await db.poems.where('id').equals(Number($currentPoem)).modify({
			note: noteProps.note,
			poem: poemProps.poem,
			name: poemProps.poemName
		});
		toggleEdit();
	}

	async function deletePoem() {
		if (confirm('Heads up! You sure want to delete this poem?')) {
			db.poems.where('id').equals(Number($currentPoem)).delete();
			goto('/stash', { replaceState: false });
		}
	}

</script>

<div class="w-11/12 pt-5 md:pt-0 text-center md:text-right mx-auto dark:text-stone-100">
	<button
		on:click={() => generateImage(poemProps.poemName)}
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
		>Export as image</button
	>
	{#if !editMode}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
			on:click={toggleEdit}>Edit</button
		>
	{:else}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
			on:click={save}>Save</button
		>
	{/if}

	<button
		on:click={() => deletePoem()}
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block"
		>Forget poem</button
	>
</div>
{#if loaded}
	<Workspace bind:poemProps bind:noteProps editable={editMode} />
{/if}
