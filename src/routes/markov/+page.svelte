<script>
	import { onMount } from 'svelte';
	import rita from 'rita';
	import { Preferences } from '@capacitor/preferences';

	let fileContent = null;
	let loaded = false;
	let lines;
	let poemAlignment;

	let n = 3;
	let temperature = 0.1;
	let nSentences = 2;

	let font;

	onMount(async () => {
		const fontPref = await Preferences.get({ key: 'notebook_font' });
		font = fontPref.value || 'halogen';
		const poemAlignmentPref = await Preferences.get({ key: 'poem_alignment' });
		poemAlignment = poemAlignmentPref.value || 'left';
	});

	function handleFileUpload(event) {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			fileContent = reader.result;
		};
		reader.readAsText(file);
		loaded = true;
	}

	function generatePoem() {
		try {
			const rm = new rita.RiMarkov(n);
			rm.addText(fileContent);
			lines = rm.generate(nSentences, { temperature: temperature });
		} catch (e) {
			alert("Couldn't generate anything! Try lower n-value and/or number of lines");
		}
	}
</script>

<div>
	<p class="text-center w-6/12 mx-auto text-lg mt-5">
		PokeMarkov is an experimental approach to generative writing. It uses Markov chains (n-gram
		models) to produce the text based on an arbitrary input, which can anything: poetry, prose,
		dialogue, etc. Keep in mind that this is a "naive" approach that doesn't consider rhyming
		patterns or forms. And it can be quite messy.
	</p>
	<p class="text-center w-6/12 mx-auto text-lg mt-5">
		First, upload the corpus (Only .txt files are supported).
	</p>
	<div class="flex justify-center text-center mx-auto mt-5">
		<input class="text-center" type="file" id="file-upload" on:change={handleFileUpload} />
	</div>
	{#if loaded}
		<p class="text-center w-6/12 mx-auto text-lg mt-5">
			Now, enter the parameters.
			<br />
			<b>n-value</b> determines the number of elements to consider
			<br />
			Higher <b>temperature</b> means that less frequent elements will appear more often
		</p>
		<div class="pt-5 mx-10">
			<div class="flex justify-center">
				<label for="input-n" class="pr-5 font-semibold">n-value</label>
				<input class="" type="number" id="input-n" min="2" bind:value={n} />
			</div>
			<div class="flex justify-center">
				<label for="input-nSentences" class="pr-5 font-semibold">Number of sentences</label>
				<input class="" type="number" id="input-nSentences" min="2" bind:value={nSentences} />
			</div>
			<div class="flex justify-center">
				<label for="input-temperature" class="pr-5 font-semibold">Temperature</label>
				<input
					class="mr-5"
					type="range"
					min="0.1"
					max="2048"
					step="0.1"
					id="input-temperature"
					bind:value={temperature}
				/>
				<div>{temperature}</div>
			</div>
		</div>
		<div class="text-center mx-auto mt-5">
			<button id="markov-talk" class="font-semibold" disabled={!loaded} on:click={generatePoem}
				>Generate</button
			>
		</div>
	{/if}
	{#if lines != null}
		<div class="w-6/12 mx-auto mt-10">
			<div class="top text-white leading-[50px] pl-5 font-bold" />
			<div class="paper">
				<p class="leading-[32px] {font} {poemAlignment} text-center mx-auto">
					{#each lines as line}
						{line}<br />
					{/each}
				</p>
			</div>
		</div>
	{/if}
</div>
