import { Share } from '@capacitor/share';
import toast from 'svelte-french-toast';

import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

export async function sharePoem(poemName: string, poemBody: string, toastMessage: string) {
	const poemTextToShare = `${poemName}\n\n${poemBody}\n`;
	if ((await Share.canShare()).value)
		await Share.share({
			title: `PokeBook | ${poemName}`,
			dialogTitle: `PokeBook | ${poemName}`,
			text: poemTextToShare,
			url: 'https://book3.pokeghost.org'
		});
	else {
		navigator.clipboard.writeText(poemTextToShare);
		toast.success(toastMessage, {
			position: GLOBAL_TOAST_POSITION,
			style: GLOBAL_TOAST_STYLE
		});
	}
}
