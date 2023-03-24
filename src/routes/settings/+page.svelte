<script>
	import { font, poemAlignment } from '../../stores/font';

	const fonts = [
		{ family: 'halogen', displayName: 'Halogen' },
		{ family: 'hashtag', displayName: 'Hashtag' },
		{ family: 'ammys', displayName: 'Ammys Handwriting' },
		{ family: 'journal', displayName: 'Journal' },
		{ family: 'damagrafik', displayName: 'Damagrafik Script' },
		{ family: 'jphand', displayName: 'JP Hand' },
		{ family: 'arial', displayName: 'Arial' },
		{ family: 'oldattic', displayName: 'Times Old Attic Bold' },
		{ family: 'crimson', displayName: 'Crimson Roman' },
		{ family: 'comic', displayName: 'Comic Sans MS' },
	];

	const alignments = [
		{ alignmentClass: 'text-left', displayName: 'Left' },
		{ alignmentClass: 'text-center', displayName: 'Centered' },
		{ alignmentClass: 'text-right', displayName: 'Right' }
	];
</script>

<div class="w-11/12 mt-10 mx-auto">
	<div class="mb-5">
		<label for="font" class="dark:text-stone-100">Notebook font:</label>

		<select bind:value={$font}>
			{#each fonts as font}
				<option value={font.family}>
					{font.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="font" class="dark:text-stone-100">Poem alignment:</label>

		<select bind:value={$poemAlignment}>
			{#each alignments as alignment}
				<option value={alignment.alignmentClass}>
					{alignment.displayName}
				</option>
			{/each}
		</select>
	</div>
</div>
