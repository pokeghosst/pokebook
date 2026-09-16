import { Bolt, Layers, SquareText } from '@lucide/svelte';
import type { MenuItem } from '../types';

export const navMenuItems: MenuItem[] = [
	{
		icon: SquareText,
		label: 'menu.draft',
		url: '/'
	},
	{
		icon: Layers,
		label: 'menu.stash',
		url: '/stash'
	},
	{
		icon: Bolt,
		label: 'menu.settings',
		url: '/settings'
	}
];
