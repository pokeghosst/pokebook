<script lang="ts">
	import type { ToolbarItem } from 'lib//types';

	export let actions: ToolbarItem[];
</script>

<div class="toolbar-menu">
	{#each actions as action}
		<button on:click={() => action.action()}>
			<svelte:component this={action.icon} />
			{action.label}
		</button>
	{/each}
</div>
