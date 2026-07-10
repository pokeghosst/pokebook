// Copyright 2026 Pokeghost
// SPDX-License-Identifier: AGPL-3.0-or-later
// Derivative work of Tauri Programme within The Commons Conservancy

// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

export type InvokeArgs<T> = T & Record<string, unknown>;

interface InvokeOptions {
	signal?: AbortSignal;
}

interface TauriInternals {
	invoke<T>(cmd: string, args?: Record<string, unknown>, options?: InvokeOptions): Promise<T>;
}

declare global {
	interface Window {
		__TAURI_INTERNALS__: TauriInternals;
	}
}

export async function invoke<T = unknown>(
	cmd: string,
	args: Record<string, unknown> = {},
	options?: InvokeOptions
): Promise<T> {
	return window.__TAURI_INTERNALS__.invoke<T>(cmd, args, options);
}

/*
	On Tauri side, we return Result<T, E> where E is always String.
	This function turns error strings into proper Error objects to
	stay Capacitor-compatible and allow consumers to predictably
	handle these errors.
*/
export async function invokeWithThrow<T>(
	cmd: string,
	args: Record<string, unknown> = {},
	options?: InvokeOptions
): Promise<T> {
	try {
		return await invoke<T>(cmd, args, options);
	} catch (e: unknown) {
		throw new Error(String(e));
	}
}
