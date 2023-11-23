<script lang="ts">
	import { t } from '$lib/translations';

	import ChevronDown from './svg/ChevronDown.svelte';

	export let parameterName: string;
	export let labelName: string;
	export let bindParameter: string | undefined;
	export let options: { value: string; label: string }[] = [];
	export let localizeLabel = true;
</script>

<div class="settings-select">
	<label for={parameterName}>{labelName}</label>
	<select bind:value={bindParameter} name={parameterName}>
		{#each options as option}
			<option value={option.value}>
				{localizeLabel ? $t(option.label) : option.label}
			</option>
		{/each}
	</select>
	<div class="settings-select-chevron-wrapper">
		<ChevronDown />
	</div>
</div>
