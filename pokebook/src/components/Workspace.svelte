<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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
	import { onDestroy, onMount, type ComponentType } from 'svelte';

	import hotkeys from 'hotkeys-js';

	import { usePreferences, type PreferencesStore } from 'lib/hooks/usePreferences.svelte';

	import ArrowRightLeft from 'lucide-svelte/icons/arrow-right-left';
	import ChevronsLeftRight from 'lucide-svelte/icons/chevrons-left-right';

	import type { Icon } from 'lucide-svelte';
	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';
	import Toolbar from './Toolbar.svelte';

	let {
		poem,
		note,
		actions
	}: {
		poem: { title: PreferencesStore; text: PreferencesStore };
		note: PreferencesStore;
		actions: { icon: ComponentType<Icon>; action: () => void; label: string }[];
	} = $props();

	let writingPadsState = usePreferences('notebook_positions', JSON.stringify(['poem', 'note']));
	let isFullWidthPad = usePreferences('full_width_pad', 'false');
	let notebookFont = usePreferences('notebook_font', 'halogen');

	let currentState = $state('');

	// TODO: Maybe refactor hotkeys into a hook or something like that
	onMount(() => {
		hotkeys('ctrl+e, command+e', function () {
			expandPoemPad();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+e, command+e');
	});

	function swapViews() {
		currentState = 'transitioning';
		setTimeout(function () {
			const state = JSON.parse(writingPadsState.value);
			[state[0], state[1]] = [state[1], state[0]];
			writingPadsState.value = JSON.stringify(state);
			currentState = '';
		}, 300);
	}

	function expandPoemPad() {
		isFullWidthPad.value = isFullWidthPad.value === 'true' ? 'false' : 'true';
	}
</script>

{#snippet pad(state: string)}
	{#if state === 'poem'}
		<PoemPad {poem} />
	{:else if state === 'note'}
		<NotePad {note} />
	{:else}
		D'oh!
	{/if}
{/snippet}

<div class="toolbar"><Toolbar {actions} /></div>
<div
	class="workspace {isFullWidthPad.value === 'true'
		? 'l-full-width'
		: ''} {currentState} {notebookFont.value}"
>
	<div class="notebook-container">
		<div class="notebook-container-toolbar">
			<div>
				<button onclick={expandPoemPad}>
					<ChevronsLeftRight class="round-button" />
				</button>
				<button onclick={swapViews}>
					<ArrowRightLeft class="round-button" />
				</button>
			</div>
		</div>
		{@render pad(JSON.parse(writingPadsState.value)[0])}
	</div>
	<div class="notebook-container">
		{@render pad(JSON.parse(writingPadsState.value)[1])}
	</div>
</div>
