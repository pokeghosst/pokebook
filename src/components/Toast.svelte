<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import CloseCircle from './svg/CloseCircle.svelte';
	import { onMount } from 'svelte';

	export let isCloseable = true;
	let nodeRef: Node;
	let isReady = false;

	onMount(() => (isReady = true));
	// transition:fly={{ y: 100, duration: 600 }}
</script>

{#if isReady}
	<div class="toast" bind:this={nodeRef}>
		{#if isCloseable}
			<div class="close-toast">
				<button on:click={() => nodeRef.parentNode?.removeChild(nodeRef)}><CloseCircle /></button>
			</div>
		{/if}
		<div class="toast-body">
			<slot name="toast-body" />
		</div>
	</div>
{/if}
