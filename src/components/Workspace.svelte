<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

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
	import { font, fullWidthPad } from '$lib/state.svelte';
	import hotkeys from 'hotkeys-js';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import NotePad from './NotePad.svelte';
	import PoemPad from './PoemPad.svelte';
	import Toolbar from './Toolbar.svelte';

	interface Props {
		toolbar: Snippet;
	}

	let { toolbar }: Props = $props();

	let currentState = $state('');

	onMount(() => {
		hotkeys('ctrl+e, command+e', function () {
			expandPoemPad();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+e, command+e');
	});

	function expandPoemPad() {
		fullWidthPad.value = !fullWidthPad.value;
	}
</script>

<div class="workspace {fullWidthPad.value ? 'l-full-width' : ''} {currentState} {font.value}">
	<!-- <div class="notebook-container"> -->
	<!-- <div class="notebook-container-toolbar">
			<div>
				<button onclick={expandPoemPad}>
					<ChevronsLeftRight class="round-button" />
				</button>
				<button onclick={swapViews}>
					<ArrowRightLeft class="round-button" />
				</button>
			</div>
		</div> -->
	<PoemPad />
	<!-- </div> -->
	<!-- <div class="notebook-container note"> -->
	<button class="notes-toggle">Note</button>
	<NotePad />
	<!-- </div> -->
</div>
<Toolbar>{@render toolbar()}</Toolbar>
