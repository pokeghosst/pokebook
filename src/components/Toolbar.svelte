<script lang="ts">
	import { type ComponentType } from 'svelte';

	export let actions: { icon: ComponentType; action: () => void; label: string }[];
</script>

<div class="toolbar-menu">
	{#each actions as action}
		<button on:click={() => action.action()}>
			<svelte:component this={action.icon} ... />
			{action.label}
		</button>
	{/each}
</div>
