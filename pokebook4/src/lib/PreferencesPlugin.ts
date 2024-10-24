export interface PreferencesPlugin {
	get(options: GetOptions): Promise<GetResult>;
	set(options: SetOptions): Promise<void>;
	remove(options: RemoveOptions): Promise<void>;
	clear(): Promise<void>;
}

export interface GetOptions {
	key: string;
}

export interface SetOptions {
	key: string;
	value: string;
}

export interface GetResult {
	value: string | null;
}

export interface RemoveOptions {
	key: string;
}
