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
	import { navMenuItems } from '$lib/constants/NavMenuItems';
	import { sidebarOpen } from '$lib/state.svelte';
	import { t } from '$lib/translations';
	import { modals } from 'svelte-modals';
	import { createBubbler, run } from 'svelte/legacy';
	import AboutModal from './AboutModal.svelte';
	import HotkeysModal from './HotkeysModal.svelte';
	import Modal from './Modal.svelte';
	import { Keyboard, MessageCircleQuestion } from 'lucide-svelte';

	const bubble = createBubbler();

	function handleSidebarItemClick() {
		if (window.innerWidth < 1024) {
			sidebarOpen.value = false;
		}
	}

	let sidebarNavOpenClass = $state('');

	run(() => {
		sidebarOpen.value ? (sidebarNavOpenClass = 'sidebar-nav--open') : (sidebarNavOpenClass = '');
	});
</script>

<div class="sidebar-nav-wrapper">
	<div
		class="sidebar-close-area {sidebarNavOpenClass}"
		onclick={() => (sidebarOpen.value = false)}
		onkeydown={bubble('keydown')}
		role="button"
		tabindex="0"
	></div>
	<div class="sidebar {sidebarNavOpenClass}">
		<div class="sidebar-nav-items">
			{#each navMenuItems as item, index (navMenuItems[index])}
				<a href={item.url} onclick={() => handleSidebarItemClick()}>
					<div class="list-item">
						<item.icon aria-hidden="true" />
						<span class="visually-hidden-desktop">{$t(item.label)}</span>
					</div>
				</a>
			{/each}
		</div>
		<div class="sidebar-footer">
			<button
				onclick={() =>
					modals.open(Modal, { title: $t('workspace.hotkeys'), content: HotkeysModal })}
			>
				<div class="list-item">
					<Keyboard aria-hidden="true" class="desktop-only-icon" />
					<span class="visually-hidden-desktop">{$t('menu.shortcuts')}</span>
				</div>
			</button>

			<button onclick={() => modals.open(Modal, { content: AboutModal })}>
				<div class="list-item">
					<MessageCircleQuestion aria-hidden="true" class="desktop-only-icon" />
					<span class="visually-hidden-desktop">{$t('menu.about')}</span>
				</div></button
			>
		</div>
	</div>
</div>
