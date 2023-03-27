<script>
	import { font, poemAlignment } from '../../stores/font';
	import { dayTheme, nightTheme } from '../../stores/mode';

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

	const dayThemes = [
		{ themeClass: 'vanilla', displayName: 'Plain Vanilla' },
		{ themeClass: 'strawberry', displayName: 'Strawberry Sundae' },
	];

	const nightThemes = [
		{ themeClass: 'chocolate', displayName: 'Chocolate' },
		// { themeClass: 'black-lobelia', displayName: 'Black Lobelia' },
	];
</script>

<div class="w-11/12 mt-10 mx-auto">
	<div class="mb-5">
		<label for="font">Notebook font:</label>

		<select bind:value={$font}>
			{#each fonts as font}
				<option value={font.family}>
					{font.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="font">Poem alignment:</label>

		<select bind:value={$poemAlignment}>
			{#each alignments as alignment}
				<option value={alignment.alignmentClass}>
					{alignment.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="dayTheme">Day theme:</label>

		<select bind:value={$dayTheme} on:change="{() => {
			if (!document.documentElement.classList.contains("dark")) {
				document.documentElement.classList.value = $dayTheme;
			}
		}}">
			{#each dayThemes as theme}
				<option value={theme.themeClass}>
					{theme.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="nightTheme">Night theme:</label>

		<select bind:value={$nightTheme} on:change="{() => {
			if (!document.documentElement.classList.contains("dark")) {
				document.documentElement.classList.value = $nightTheme;
			}
		}}">
			{#each nightThemes as theme}
				<option value={theme.themeClass}>
					{theme.displayName}
				</option>
			{/each}
		</select>
	</div>
</div>
