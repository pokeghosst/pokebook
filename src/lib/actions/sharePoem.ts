import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
import toast from 'svelte-5-french-toast';

export async function sharePoem(poemName: string, poemBody: string, toastMessage: string) {
	const text = poemName + '\n\n' + poemBody;
	const title = `PokeBook | ${poemName}`;

	try {
		await navigator.share({ title, text });
	} catch (_) {
		navigator.clipboard.writeText(text);
		toast.success(toastMessage, {
			position: GLOBAL_TOAST_POSITION,
			style: GLOBAL_TOAST_STYLE
		});
	}
}
