import type { PoemCacheRecord } from "@lib/types";

export interface PoemCacheManagerPlugin {
  push(options: PushOptions): Promise<void>;
  get(options: GetOptions): Promise<GetResult>;
  pop(options: PopOptions): Promise<void>;
}

export interface PushOptions {
  value: PoemCacheRecord;
}

export interface GetOptions {
  key: string;
}

export interface GetResult {
  value: PoemCacheRecord | null;
}

export interface PopOptions {
  key: string;
}
