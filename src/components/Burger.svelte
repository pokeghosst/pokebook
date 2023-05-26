<script>
	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<div class="absolute top-10 z-50">
	<button class="focus:outline-none lg:hidden" on:click={toggleMenu} id="burger-button">
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	</button>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
		class={`fixed bg-transparent top-0 h-full transition-transform duration-200 transform ${
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		}`}
		style="width: 100%; left: 0"
        on:click={closeMenu}
	>
    </div>
	<div
		class={`fixed top-0 h-full transition-transform duration-200 transform ${
			menuOpen ? 'translate-x-0' : 'translate-x-full'
		}`}
		id="burger-bar"
		style="width: 80%; right: 0"
	> 
		<div class="mt-10" />
		<div class="block px-4 py-2">
			<a
				href="/markov"
				class="underline decoration-dotted decoration-1 hover:no-underline block text-xl"
				on:click={closeMenu}>PokeMarkov</a
			>
		</div>
		<div class="burger-border border-t border-gray-100" />
		<div class="block px-4 py-2">
			<a
				href="/stash"
				class="underline decoration-dotted decoration-1 hover:no-underline block text-xl"
				on:click={closeMenu}>Poem Stash</a
			>
		</div>
		<div class="burger-border border-t border-gray-100" />
		<div class="block px-4 py-2 ">
			<a
				href="/settings"
				class="underline decoration-dotted decoration-1 hover:no-underline block text-xl"
				on:click={closeMenu}>Settings</a
			>
		</div>
		<div class="burger-border border-t border-gray-100" />
		<div class="block px-4 py-2 ">
			<a
				href="https://www.buymeacoffee.com/pokegh0st"
				target="_blank"
				rel="noreferrer"
				class="block text-xl"
				on:click={closeMenu}
				><span class="underline decoration-dotted decoration-1 hover:no-underline">Donate</span>
				<span class="text-xs align-sub">(pwease?)</span></a
			>
		</div>
	</div>
</div>
