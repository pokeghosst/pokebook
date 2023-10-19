<script>
	import { onMount, onDestroy } from 'svelte';
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
	<svg
		fill="#000000"
		width="800px"
		height="800px"
		viewBox="0 0 32 32"
		class="round-button"
		xmlns="http://www.w3.org/2000/svg"
		><path
			d="M10.429 16a2.715 2.715 0 1 1-5.43 0 2.715 2.715 0 0 1 5.43 0zM16 13.286a2.715 2.715 0 1 0 .001 5.429A2.715 2.715 0 0 0 16 13.286zm8.285 0a2.714 2.714 0 1 0 0 5.428 2.714 2.714 0 0 0 0-5.428z"
		/></svg
	>
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
			<!-- <button
				class="block px-4 py-2 text-sm border-b border-b-gray-200 text-gray-700 hover:bg-gray-100 w-full focus:outline-none"
			>
				New poem (save draft)
			</button>
			<button
				class="block px-4 py-2 text-sm border-b border-b-gray-200 text-gray-700 hover:bg-gray-100 w-full focus:outline-none"
			>
				Forget poem
			</button>
			<button
				class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full focus:outline-none"
			>
				Export as image
			</button> -->
		</div>
	</div>
{/if}
