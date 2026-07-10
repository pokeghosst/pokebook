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
	import { CURRENT_VERSION } from '$lib/constants/version';
	import {
		activeLanguage,
		dayTheme,
		latestSeenVersion,
		nightTheme,
		safeToClose,
		sidebarOpen,
		themeMode
	} from '$lib/state.svelte';
	import { loadTranslations } from '$lib/translations';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-5-french-toast';
	import { modals, Modals } from 'svelte-modals';
	import { createBubbler } from 'svelte/legacy';
	import Header from '../components/Header.svelte';
	import Modal from '../components/Modal.svelte';
	import NewVersionModal from '../components/NewVersionModal.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	const bubble = createBubbler();
	let { children }: Props = $props();

	$effect(() => {
		loadTranslations(activeLanguage.value);
	});

	$effect(() => {
		(themeMode.value, dayTheme.value, nightTheme.value, updateTheme());
	});

	onMount(() => {
		if (latestSeenVersion.value !== CURRENT_VERSION) {
			if (latestSeenVersion.value) {
				modals.open(Modal, { content: NewVersionModal });
			}
			latestSeenVersion.value = CURRENT_VERSION;
		}
	});

	function updateTheme() {
		document.documentElement.className = '';

		switch (themeMode.value) {
			case 'day': {
				document.documentElement.classList.add(dayTheme.value || 'vanilla');
				break;
			}
			case 'night': {
				document.documentElement.classList.add('dark');
				document.documentElement.classList.add(nightTheme.value || 'chocolate');
				break;
			}
			case 'auto': {
				const prefersDark = window.matchMedia('(prefers-color-scheme:dark)');

				const applyAutoTheme = () => {
					document.documentElement.className = '';

					if (prefersDark.matches) {
						document.documentElement.classList.add(nightTheme.value || 'chocolate');
					} else {
						document.documentElement.classList.add(dayTheme.value || 'vanilla');
					}
				};

				applyAutoTheme();
				prefersDark.addEventListener('change', applyAutoTheme);
				break;
			}
		}
	}
</script>

<svelte:window
	onbeforeunload={(e) => {
		if (!safeToClose.value) e.preventDefault();
	}}
/>

<Modals>
	{#snippet backdrop({ close })}
		<div
			class="backdrop"
			onclick={() => close()}
			onkeydown={bubble('keydown')}
			role="button"
			tabindex="0"
		></div>
	{/snippet}
</Modals>

<Toaster />
<Sidebar />

<div class="main-wrapper {sidebarOpen.value ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header />
			{@render children?.()}
		</div>
	</main>
</div>
