import type { PoemCacheRecord } from "@lib/types";

export interface PoemCacheManagerPlugin {
  push(poem: PoemCacheRecord): Promise<void>;
  get(key: string): Promise<PoemCacheRecord | null>;
  pop(key: string): Promise<void>;
  list(): Promise<PoemCacheRecord[]>;
}
