<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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
	import type { ComponentType } from 'svelte';

	import { closeModal } from 'svelte-modals';

	import X from 'lucide-svelte/icons/x';

	export let isOpen = false;

	export let title: string | null = null;
	export let content: ComponentType;
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="modal-title-bar">
			{#if title}
				<div class="modal-title">{title}</div>
			{/if}
			<div class="modal-title-side">
				<button on:click={closeModal}><X /></button>
			</div>
		</div>
		<div class="modal-content">
			<svelte:component this={content} />
		</div>
	</div>
{/if}
