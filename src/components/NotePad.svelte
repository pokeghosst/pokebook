<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	import { t } from '$lib/translations';

	export let editable: boolean;
	export let props: Writable<string>;

	let lines = $props.split('\n');
	let noteTextarea: HTMLTextAreaElement;

	onMount(async () => {
		// Resize the notebook when switching between single/dual panes
		const resizeObserver = new ResizeObserver(autoResizeNotebook);
		resizeObserver.observe(noteTextarea);

		return () => {
			resizeObserver.unobserve(noteTextarea);
			resizeObserver.disconnect();
		};
	});

	$: lines = $props.split('\n');
	$: lines, autoResizeNotebook();

	async function autoResizeNotebook() {
		// Requesting the animation frame twice is the most reliable way to
		// have correct auto resizing even on long text in MOST cases
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (noteTextarea) {
					const scrollPosition = window.scrollY;
					noteTextarea.style.height = 'auto';
					noteTextarea.style.height = `${noteTextarea.scrollHeight}px`;
					window.scrollTo(0, scrollPosition);
				}
			});
		});
	}
</script>

<div class="notebook">
	<div class="notebook-header">{$t('workspace.note')}</div>
	<div>
		<textarea
			bind:value={$props}
			disabled={!editable}
			class="paper"
			id="note-textarea"
			bind:this={noteTextarea}
		/>
	</div>
</div>
