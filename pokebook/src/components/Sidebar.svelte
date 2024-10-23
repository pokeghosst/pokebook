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
	import { openModal } from 'svelte-modals';

	import { t } from '$lib/translations';

	import { navMenuItems } from '$lib/constants/NavMenuItems';

	import type { PreferencesStore } from 'lib/hooks/usePreferences.svelte';

	import AboutModal from './AboutModal.svelte';
	import HotkeysModal from './HotkeysModal.svelte';
	import Modal from './Modal.svelte';

	let { isSidebarOpen }: { isSidebarOpen: PreferencesStore } = $props();
	let sidebarNavOpenClass = $derived(isSidebarOpen.value === 'true' ? 'sidebar-nav--open' : '');

	function handleSidebarItemClick() {
		if (window.innerWidth < 1024) {
			isSidebarOpen.value = 'false';
		}
	}
</script>

<div class="sidebar-nav-wrapper">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="sidebar-close-area {sidebarNavOpenClass}"
		onclick={() => {
			isSidebarOpen.value = 'false';
		}}
		role="button"
		tabindex="0"
	></div>
	<div class="sidebar {sidebarNavOpenClass}">
		<div class="sidebar-nav-items">
			{#each navMenuItems as Item, index (navMenuItems[index])}
				<a href={Item.url} onclick={handleSidebarItemClick}>
					<div class="list-item">
						<Item.icon />
						{$t(Item.label)}
					</div>
				</a>
			{/each}
		</div>
		<div class="sidebar-footer">
			<!-- eslint-disable @typescript-eslint/no-explicit-any -->
			<!-- This doesn't matter since we'll migrate to Melt UI anyway -->
			<button
				onclick={() =>
					openModal(Modal, { title: $t('workspace.hotkeys'), content: HotkeysModal as any })}
				>{$t('menu.shortcuts')}</button
			>
			<ul>
				<li>
					<button onclick={() => openModal(Modal, { content: AboutModal as any })}
						>{$t('menu.about')}</button
					>
				</li>
			</ul>
		</div>
	</div>
</div>
