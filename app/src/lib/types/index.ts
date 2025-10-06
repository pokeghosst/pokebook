export * from './StorageDriver';

import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

// TODO: Drop this!
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

declare global {
	interface Window {
		__TAURI_INTERNALS__: Record<string, unknown>;
	}
}
