import { Share } from '$lib/plugins/Share';
import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
import toast from 'svelte-5-french-toast';

export async function sharePoem(poemName: string, poemBody: string, toastMessage: string) {
	const poemTextToShare = poemName + '\n\n' + poemBody;

	if ((await Share.canShare()).value)
		await Share.share({
			title: `PokeBook | ${poemName}`,
			text: poemTextToShare
		});
	else {
		navigator.clipboard.writeText(poemTextToShare);
		toast.success(toastMessage, {
			position: GLOBAL_TOAST_POSITION,
			style: GLOBAL_TOAST_STYLE
		});
	}
}
