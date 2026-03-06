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
	import appState from '$lib/AppState.svelte';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';
	import { nightTheme } from '$lib/stores/nightTheme';
	import { themeMode } from '$lib/stores/themeMode';
	import { Toaster } from 'svelte-french-toast';
	import { Modals, closeModal } from 'svelte-modals';
	import { createBubbler, run } from 'svelte/legacy';
	import Header from '../components/Header.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	const bubble = createBubbler();
	let { children }: Props = $props();

	function updateTheme() {
		document.documentElement.className = '';

		switch ($themeMode) {
			case 'day': {
				document.documentElement.classList.add($dayTheme || 'vanilla');
				break;
			}
			case 'night': {
				document.documentElement.classList.add('dark');
				document.documentElement.classList.add($nightTheme || 'chocolate');
				break;
			}
			case 'auto': {
				const prefersDark = window.matchMedia('(prefers-color-scheme:dark)');

				const applyAutoTheme = () => {
					document.documentElement.className = '';

					if (prefersDark.matches) {
						document.documentElement.classList.add($nightTheme || 'chocolate');
					} else {
						document.documentElement.classList.add($dayTheme || 'vanilla');
					}
				};

				applyAutoTheme();
				prefersDark.addEventListener('change', applyAutoTheme);
				break;
			}
		}
	}
	run(() => {
		($themeMode, $dayTheme, $nightTheme, updateTheme());
	});
</script>

<svelte:window
	onbeforeunload={(e) => {
		if (!appState.value.safeToClose) e.preventDefault();
	}}
/>

<Modals>
	{#snippet backdrop()}
		<div
			class="backdrop"
			onclick={closeModal}
			onkeydown={bubble('keydown')}
			role="button"
			tabindex="0"
		></div>
	{/snippet}
</Modals>

<Toaster />
<Sidebar />
<div class="main-wrapper {$isSidebarOpen === 'true' ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header />
			{@render children?.()}
		</div>
	</main>
</div>
