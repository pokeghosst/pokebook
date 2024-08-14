<script lang="ts">
	import { poemPadJustification } from 'lib//stores/poemPadJustification';

	import type { ToolbarItem } from '$lib/types';

	import AlignLeft from 'lucide-svelte/icons/align-left';
	import AlignCenter from 'lucide-svelte/icons/align-center';
	import AlignRight from 'lucide-svelte/icons/align-right';
	import Type from 'lucide-svelte/icons/type';

	export let actions: ToolbarItem[];
</script>

<div class="toolbar-menu">
	<div class="button-group">
		<button
			on:click={() => ($poemPadJustification = 'left')}
			class={$poemPadJustification === 'left' ? 'active' : ''}
		>
			<AlignLeft />
		</button>
		<button
			on:click={() => ($poemPadJustification = 'center')}
			class={$poemPadJustification === 'center' ? 'active' : ''}
		>
			<AlignCenter />
		</button>
		<button
			on:click={() => ($poemPadJustification = 'right')}
			class={$poemPadJustification === 'right' ? 'active' : ''}
		>
			<AlignRight />
		</button>
	</div>
	<button on:click={() => {}}>
		<Type />
	</button>
	{#each actions as action}
		<button on:click={() => action.action()}>
			<svelte:component this={action.icon} />
			{action.label}
		</button>
	{/each}
</div>
