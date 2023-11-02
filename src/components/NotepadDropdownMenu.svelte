<script>
	import { onMount, onDestroy } from 'svelte';
	import BurgerRows from './svg/BurgerRows.svelte';
	export let actions;

	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		isOpen = false;
	}

	function handleDocumentClick(event) {
		if (isOpen && !event.target.closest('.dropdown')) {
			closeDropdown();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);
	});

	// TODO: Remove listeners from other components on destroy
	onDestroy(() => {
		document.removeEventListener('click', handleDocumentClick);
	});
</script>

<button class="dropdown" on:click={toggleDropdown}>
	<BurgerRows/>
</button>
{#if isOpen}
	<div class="dropdown-menu origin-top-right absolute right-0 mt-12 w-48">
		<div class="rounded-md">
			{#each actions as action}
				<button
					class="dropdown-menu__item block px-4 py-2 text-sm border-b w-full focus:outline-none"
					on:click={action.action}
				>
					{action.label}
				</button>
			{/each}
		</div>
	</div>
{/if}
