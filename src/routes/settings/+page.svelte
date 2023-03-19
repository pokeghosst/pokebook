<script>
	import { font } from '../../stores/font';

	const fonts = [
		{ id: 1, family: 'halogen', displayName: 'Halogen' },
		{ id: 1, family: 'hashtag', displayName: 'Hashtag' },
		{ id: 1, family: 'ammys', displayName: 'Ammys Handwriting' },
		{ id: 1, family: 'journal', displayName: 'Journal' },
		{ id: 1, family: 'damagrafik', displayName: 'Damagrafik Script' },
		{ id: 1, family: 'jphand', displayName: 'JP Hand' },
	];
</script>

<div class="w-11/12 mt-10 mx-auto">
	<div>
		<label for="font">Notebook font:</label>

		<select bind:value={$font}>
			{#each fonts as font}
				<option value={font.family}>
					{font.displayName}
				</option>
			{/each}
		</select>
	</div>
</div>
