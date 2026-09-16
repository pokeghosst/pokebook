import { Bolt, Book, Library, SquareText } from '@lucide/svelte';
import type { MenuItem } from '../types';

export const navMenuItems: MenuItem[] = [
	{
		icon: SquareText,
		label: 'menu.draft',
		url: '/'
	},
	{
		icon: Book,
		label: 'menu.stash',
		url: '/stash'
	},
	{
		icon: Bolt,
		label: 'menu.settings',
		url: '/settings'
	}
];
