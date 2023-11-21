import type { Poem } from './types/Poem';
import type { PoemFile } from './types/PoemFile';

export interface IPoemStorageDriver {
	listPoems(): Promise<PoemFile[]>;
	loadPoem(poemFile: PoemFile): Promise<Poem>;
	savePoem(poem: Poem): void;
	updatePoem(
		poem: Poem,
		poemUri: string,
		noteUri: string
	): Promise<{ newPoemUri: string; newNoteUri: string }>;
    deletePoem(poemUri: string, noteUri: string): void;
}
