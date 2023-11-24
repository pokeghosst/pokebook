<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import ThreeDots from './svg/ThreeDots.svelte';

	export let actions: { action: () => void; label: string }[];

	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		isOpen = false;
	}

	function handleDocumentClick(event: MouseEvent) {
		if (isOpen && !(event.target as HTMLElement).closest('.dropdown')) {
			closeDropdown();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleDocumentClick);
	});
</script>

<button class="dropdown" on:click={toggleDropdown}>
	<ThreeDots />
</button>
{#if isOpen}
	<div class="pad-dropdown-menu">
		{#each actions as action}
			<button on:click={() => action.action()}>
				{action.label}
			</button>
		{/each}
	</div>
{/if}
