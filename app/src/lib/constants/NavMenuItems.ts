import LibraryBig from 'lucide-svelte/icons/library-big';
import Settings from 'lucide-svelte/icons/settings';
import SquarePen from 'lucide-svelte/icons/square-pen';

import type { MenuItem } from '../types';

export const navMenuItems: MenuItem[] = [
	{
		icon: SquarePen,
		label: 'menu.draft',
		url: '/'
	},
	{
		icon: LibraryBig,
		label: 'menu.stash',
		url: '/stash'
	},
	{
		icon: Settings,
		label: 'menu.settings',
		url: '/settings'
	}
];
