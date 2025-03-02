import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export interface PoemFileEntity {
	name: string;
	poemUri: string;
	timestamp: string | number;
}
export interface PoemEntity {
	name: string;
	text: string;
	note: string;
	sync?: {
		ydoc_state: string;
		last_synced: number;
	};
}

export type MenuItem = { icon: ComponentType<Icon>; label: string; url: string };

export type ToolbarItem = { icon: ComponentType<Icon>; action: () => void; label: string };
