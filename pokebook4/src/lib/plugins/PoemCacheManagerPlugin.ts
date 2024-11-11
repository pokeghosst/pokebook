import type { PoemCacheRecord } from "@lib/types";

export interface PoemCacheManagerPlugin {
  push(poem: PoemCacheRecord): Promise<number>;
  get(key: string): Promise<PoemCacheRecord | null>;
  pop(key: string): Promise<void>;
  list(): Promise<PoemCacheRecord[]>;
}
