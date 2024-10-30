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
