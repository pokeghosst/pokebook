<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

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
	import { goto } from '$app/navigation';
	import { sharePoem } from '$lib/actions/sharePoem';
	import type { OnlyNote, OnlyPoem } from '$lib/schema/poem.schema';
	import { deletePoem, getPoem, updatePoem } from '$lib/services/poem.service';
	import { safeToClose, currentPoemUri } from '$lib/state.svelte';
	import { t } from '$lib/translations';
	import type { InputChangeEvent, InputChangeHandler } from '$lib/types';
	import { debounceWithState } from '$lib/util';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import { onMount, setContext } from 'svelte';
	import toast from 'svelte-french-toast';
	import Workspace from '../../../components/Workspace.svelte';

	let thinking = $state(true);

	let poem = $state<OnlyPoem>({ name: '', text: '' });
	let note = $state<OnlyNote>({ note: '' });

	setContext('poem', poem);
	setContext('note', note);
	setContext<[InputChangeHandler<HTMLInputElement>, InputChangeHandler<HTMLTextAreaElement>]>(
		'poemHandlers',
		[handleNameChange, handleTextChange]
	);
	setContext('noteHandler', handleNoteChange);

	const updatePoemDebounce = debounceWithState(updatePoem, 400);

	onMount(async () => {
		try {
			const { name: name_, text: text_, note: note_ } = await getPoem(currentPoemUri.value);

			poem.name = name_;
			poem.text = text_;
			note.note = note_;
		} catch (e) {
			if (e instanceof Error) {
				toast.error($t(e.message), {
					position: GLOBAL_TOAST_POSITION,
					style: GLOBAL_TOAST_STYLE
				});
			}
		}
		thinking = false;
	});

	async function handleNameChange(e: InputChangeEvent<HTMLInputElement>) {
		poem.name = e.currentTarget.value;

		currentPoemUri.value = await updatePoem(currentPoemUri.value, {
			name: poem.name.trim().length === 0 ? 'Unnamed' : poem.name,
			text: poem.text,
			...note
		});
	}

	function handleTextChange(e: InputChangeEvent<HTMLTextAreaElement>) {
		poem.text = e.currentTarget.value;
		safeToClose.value = false;

		updatePoemDebounce(currentPoemUri.value, { ...poem, ...note })
			.catch((error) => console.error('Save failed:', error))
			.finally(() => {
				safeToClose.value = true;
			});
	}

	function handleNoteChange(e: InputChangeEvent<HTMLInputElement>) {
		note.note = e.currentTarget.value;
		safeToClose.value = false;

		updatePoemDebounce(currentPoemUri.value, { ...poem, ...note })
			.catch((error) => console.error('Save failed:', error))
			.finally(() => {
				safeToClose.value = true;
			});
	}

	const deletePoemAction = async () => {
		if (confirm(`${$t('toasts.forgetConfirm')}`)) {
			await toast.promise(
				deletePoemHandler(),
				{
					loading: `${$t('toasts.deletingPoem')}`,
					success: `${$t('toasts.deletedPoem')}`,
					error: `${$t('errors.poemDeleteError')}`
				},
				{
					position: GLOBAL_TOAST_POSITION,
					style: GLOBAL_TOAST_STYLE
				}
			);
		}
	};

	async function deletePoemHandler() {
		await deletePoem(currentPoemUri.value);
		await deleteTmpFile(currentPoemUri.value);
		currentPoemUri.value = '';

		await goto('/stash', { invalidateAll: true });
	}

	let actions = [
		{
			icon: Share2,
			action: () => sharePoem(poem.name, poem.text, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem')
		},
		{ icon: Trash2, action: deletePoemAction, label: $t('workspace.forgetPoem') }
	];

	async function deleteTmpFile(fileUri: string) {
		try {
			await deletePoem(`${fileUri}.tmp`);
		} catch (_) {
			// Do nothing
		}
	}
</script>

{#if thinking}
	<div class="placeholder-text-wrapper">
		<p>Loading...</p>
	</div>
{:else}
	<Workspace {actions} />
{/if}
