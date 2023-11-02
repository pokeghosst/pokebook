import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

interface Poem {
	poem: {
		name: string;
		body: string;
	};
	note: string;
}

export async function localSavePoem(poem: Poem) {
	const date = new Date(Date.now());
	const poemFileName = `${poem.poem.name.replace(/ /g, '%20')}_${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	const noteFileName = `${poemFileName}_note`;

	await Filesystem.writeFile({
		path: `poems/${poemFileName}.txt`,
		data: poem.poem.body,
		directory: Directory.Data,
		encoding: Encoding.UTF8,
		recursive: true
	});
	await Filesystem.writeFile({
		path: `poems/${noteFileName}.txt`,
		data: poem.note,
		directory: Directory.Data,
		encoding: Encoding.UTF8,
		recursive: true
	});
}

export async function localLoadPoem() {}

export type { Poem };
