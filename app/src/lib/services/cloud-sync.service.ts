/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { PoemDoc } from '$lib/models/PoemDoc';
import { Database } from '$lib/plugins/Database';
import { CloudStorage } from '../plugins/CloudStorage';

import type { PoemListItem, PoemRecord, RemoteFileListItem } from '@pokebook/shared';
import { putPartialUpdate, sliceSnippet } from './poems.service';

export async function sync() {
	try {
		const remoteFiles = await CloudStorage.list();
		const localFiles = await Database.list();

		const filesToDownload = getFilesToDownload(remoteFiles, localFiles);
		const filesToUpload = getFilesToUpload(localFiles, remoteFiles);
		const filesToMerge = getFilesToMerge(localFiles, remoteFiles);

		console.log('remoteFiles', remoteFiles);
		console.log('localFiles', localFiles);
		console.log('filesToDownload', filesToDownload);
		console.log('filesToUpload', filesToUpload);
		console.log('filesToMerge', filesToMerge);

		// Download remote
		const downloadedFiles = await CloudStorage.download(filesToDownload.map((file) => file.fileId));
		console.log('downloadedFiles', downloadedFiles);
		saveFiles(downloadedFiles);

		// Upload local
		await uploadFiles(filesToUpload);

		// Merge into local
		await reconcileFiles(filesToMerge, remoteFiles);
	} catch (e: unknown) {
		if (e instanceof Error) {
			const message = e.message;

			switch (message) {
				case 'Not authenticated':
					throw new Error('errors.authentication');
				default:
					throw new Error('errors.unknown');
			}
		}
	}
}

function getFilesToUpload(localFiles: PoemListItem[], remoteFiles: RemoteFileListItem[]) {
	return localFiles.filter(
		(localFile) => !remoteFiles.find((remoteFile) => remoteFile.fileName === localFile.id)
	);
}

function getFilesToDownload(remoteFiles: RemoteFileListItem[], localFiles: PoemListItem[]) {
	return remoteFiles.filter(
		(remoteFile) => !localFiles.find((localFile) => localFile.id === remoteFile.fileName)
	);
}

function getFilesToMerge(localFiles: PoemListItem[], remoteFiles: RemoteFileListItem[]) {
	return localFiles.filter(
		(localFile) =>
			!remoteFiles.find((remoteFile) => remoteFile.syncStateHash === localFile.syncStateHash)
	);
}

async function uploadFiles(filesToUpload: PoemListItem[]) {
	const localRecords = (
		await Promise.all(
			filesToUpload.map(async (fileMeta) => {
				const fileContents = await Database.get(fileMeta.id);
				if (!fileContents) return [];

				return [{ ...fileContents }];
			})
		)
	).flat();

	await CloudStorage.upload(localRecords);
}

async function saveFiles(files: PoemRecord[]) {
	for (const file of files) {
		await Database.save(file);
	}
}

async function reconcileFiles(filesToMerge: PoemListItem[], remoteFiles: RemoteFileListItem[]) {
	for (const localFileMeta of filesToMerge) {
		const remoteFileMeta = remoteFiles.find(
			(remoteFile) => remoteFile.fileName === localFileMeta.id
		);

		if (!remoteFileMeta) continue;

		const localFile = await Database.get(localFileMeta.id);
		const remoteFile = (await CloudStorage.download([remoteFileMeta.fileId]))[0];

		if (!localFile || !remoteFile) continue;

		console.log('localFile', localFile);
		console.log('remoteFile', remoteFile);

		const localDoc = PoemDoc.fromEncodedState(localFile.syncState);
		const remoteDoc = PoemDoc.fromEncodedState(remoteFile.syncState);

		console.log('localDoc', localDoc);
		console.log('remoteDoc', remoteDoc);

		localDoc.applyUpdate(remoteDoc.getState());
		remoteDoc.applyUpdate(localDoc.getState());

		console.log('//-------------//');
		console.log('localDoc', localDoc.getText().toString());
		console.log('remoteDoc', remoteDoc.getText().toString());

		const mergedFile = {
			...localFile,
			name: localDoc.getTitle().toString(),
			text: localDoc.getText().toString(),
			note: localDoc.getNote().toString(),
			snippet: sliceSnippet(localDoc.getText().toString()),
			syncState: localDoc.getEncodedState(),
			syncStateHash: await localDoc.getEncodedStateHash(),
			remoteId: remoteFileMeta.fileId
		};

		await putPartialUpdate(mergedFile.id, mergedFile);
		console.log('starting to update poem...', mergedFile);
		await CloudStorage.update([mergedFile]);
	}
}
