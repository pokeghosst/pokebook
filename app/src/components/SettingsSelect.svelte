<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023, 2025 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

<script lang="ts">
	import { t } from '$lib/translations';

	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	let {
		parameterName,
		labelName,
		bindValue,
		bindFunction,
		options = [],
		localizeLabel = true
	}: {
		parameterName: string;
		labelName: string;
		bindValue: string;
		bindFunction: (value: string) => void;
		options: { value: string; label: string }[];
		localizeLabel?: boolean;
	} = $props();
</script>

<div class="settings-select">
	<label for={parameterName}>{labelName}</label>
	<select bind:value={() => bindValue, bindFunction} name={parameterName}>
		{#each options as option (option.label)}
			<option value={option.value}>
				{localizeLabel ? $t(option.label) : option.label}
			</option>
		{/each}
	</select>
	<div class="settings-select-chevron-wrapper">
		<ChevronDown />
	</div>
</div>
