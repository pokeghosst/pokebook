<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024, 2026 Pokeghost.

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
	import { padFonts } from '$lib/constants/PadFonts';
	import { justification, font } from '$lib/state.svelte';
	import type { ToolbarItem } from '$lib/types';
	import { ChevronDown } from 'lucide-svelte';
	import AlignCenter from 'lucide-svelte/icons/align-center';
	import AlignLeft from 'lucide-svelte/icons/align-left';
	import AlignRight from 'lucide-svelte/icons/align-right';
	import FontSize from './FontSize.svelte';

	interface Props {
		actions: ToolbarItem[];
	}

	let { actions }: Props = $props();
</script>

<div class="toolbar-menu">
	<div class="button-group">
		<button
			onclick={() => (justification.value = 'left')}
			class={`button ${justification.value === 'left' ? 'active' : ''}`}
		>
			<AlignLeft />
		</button>
		<button
			onclick={() => (justification.value = 'center')}
			class={`button ${justification.value === 'center' ? 'active' : ''}`}
		>
			<AlignCenter />
		</button>
		<button
			onclick={() => (justification.value = 'right')}
			class={`button ${justification.value === 'right' ? 'active' : ''}`}
		>
			<AlignRight />
		</button>
	</div>
	<div class="settings-select">
		<select bind:value={font.value} style="margin: 0; min-width: 130px;">
			{#each padFonts as option}
				<option value={option.value}>
					{option.label}
				</option>
			{/each}
		</select>
		<div class="settings-select-chevron-wrapper" style="margin-top: -5px">
			<ChevronDown />
		</div>
	</div>
	<FontSize />
	{#each actions as action}
		<button onclick={() => action.action()} class="button" disabled={action.disabled}>
			<action.icon />
			{action.label}
		</button>
	{/each}
</div>
