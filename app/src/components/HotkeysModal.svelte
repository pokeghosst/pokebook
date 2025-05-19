<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024-2025 Pokeghost.

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

	const hotkeys = [
		{
			keys: 'ctrl+/',
			description: 'hotkeys.toggleSidebar'
		},
		{
			keys: 'ctrl+h',
			description: 'hotkeys.pokeHelp'
		},
		{
			keys: 'ctrl+e',
			description: 'hotkeys.fullWidthPad'
		},
		{
			keys: 'ctrl+shift+n',
			description: 'hotkeys.newPoem'
		}
	];
</script>

<ul>
	{#each hotkeys as hotkey (hotkey.keys)}
		<li>
			<div class="hotkeys-item">
				<div class="hotkeys-item-keys">
					{#each hotkey.keys.split('+') as key, index (index)}
						<kbd>{key}</kbd>{#if index < hotkey.keys.split('+').length - 1}
							+
						{/if}
					{/each}
				</div>
				-
				<div class="hotkeys-item-description">{$t(hotkey.description)}</div>
			</div>
		</li>
	{/each}
</ul>
