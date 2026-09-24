import type { LucideProps } from '@lucide/svelte';
import type { Component } from 'svelte';

export type Mutable<T> = {
	-readonly [K in keyof T]: T[K];
};
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

export type MenuItem = { icon: Component<LucideProps, {}, ''>; label: string; url: string };

export type InputChangeEvent<T extends HTMLElement> = Event & { currentTarget: EventTarget & T };
export type InputChangeHandler<T extends HTMLElement> = (e: InputChangeEvent<T>) => void;
