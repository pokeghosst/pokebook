import { Share } from '$lib/plugins/Share';
import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
import toast from 'svelte-5-french-toast';

export async function sharePoem(poemName: string, poemBody: string, toastMessage: string) {
	const poemTextToShare = poemName + '\n\n' + poemBody;

	try {
		await Share.share({
			title: `PokeBook | ${poemName}`,
			text: poemTextToShare
		});
	} catch (_) {
		navigator.clipboard.writeText(poemTextToShare);
		toast.success(toastMessage, {
			position: GLOBAL_TOAST_POSITION,
			style: GLOBAL_TOAST_STYLE
		});
	}
}
