export interface PoemFileEntity {
  name: string;
  poemUri: string;
  createdAt: string;
  modifiedAt: string;
}
export interface PoemEntity {
  name: string;
  text: string;
  note: string;
}

export interface PoemCacheRecord {
  id: string;
  name: string;
  createdAt: number;
  modifiedAt: number;
  poemSnippet: string;
  unsavedChanges: boolean;
}
