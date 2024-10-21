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
}

export interface PoemCacheRecord {
	id: string;
	name: string;
	timestamp: string | number; // TODO: Check this later with different drivers, maybe harmonize
	unsavedChanges: boolean;
	poemSnippet: string;
}

export type MenuItem = { icon: ComponentType<Icon>; label: string; url: string };

export type ToolbarItem = { icon: ComponentType<Icon>; action: () => void; label: string };

declare global {
	interface Window {
		__TAURI_INTERNALS__: Record<string, unknown>;
	}
}
