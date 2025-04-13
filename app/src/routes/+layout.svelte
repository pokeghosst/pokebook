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
	import { Toaster } from 'svelte-french-toast';
	import { Modals, closeModal } from 'svelte-modals';
	import { loadTranslations } from '$lib/translations';

	import appState from '$lib/AppState.svelte';
	import Header from '../components/Header.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	let { children } = $props();

	$effect(() => {
		loadTranslations(appState.value.activeLanguage);
	});

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		appState.value.darkModeEnabled;
		updateTheme();
	});

	function updateTheme() {
		if (appState.value.darkModeEnabled) {
			document.documentElement.className = appState.value.nightTheme;
		} else {
			document.documentElement.className = appState.value.dayTheme;
		}
	}
</script>

<Modals>
	<div
		slot="backdrop"
		class="backdrop"
		onclick={closeModal}
		onkeydown={closeModal}
		role="button"
		tabindex="0"
	></div>
</Modals>

<Toaster />
<Sidebar />
<div class="main-wrapper {appState.value.sidebarOpen ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header />
			{@render children?.()}
		</div>
	</main>
</div>
