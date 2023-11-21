import { CapacitorHttp } from '@capacitor/core';
import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';
import type { Poem } from './types/Poem';

// async function loadPoemsFromDrive() {
// 	const gDriveUuidPref = await Preferences.get({ key: 'gdrive_uuid' });
// 	const options = {
// 		url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem`,
// 		headers: {
// 			Authorization: gDriveUuidPref.value
// 		}
// 	};
// 	const response = await CapacitorHttp.request({ ...options, method: 'GET' });
// 	return response;
// }

// async function loadPoemFromDrive() {
// 	const options = {
// 		url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem/${gDrivePoemId}`,
// 		headers: {
// 			Authorization: gDriveUuidPref.value,
// 			'content-type': 'application/json'
// 		}
// 	};
// 	const response = await CapacitorHttp.request({ ...options, method: 'GET' });

// 	poemProps = {
// 		poem: response.data.poem,
// 		poemName: response.data.poem_name.split('_')[0]
// 	};
// 	noteProps = {
// 		note: response.data.note
// 	};
// 	gDrivePoemTime = response.data.poem_name.split('_').slice(1, 3).join('_');
// }

export function intercloudGDriveAuth() {}

export function intercloudGDriveLogout() {}

export function intercloudGDriveListPoems() {}

export function intercloudGDriveLoadPoem() {}

export async function intercloudGDriveSavePoem(poem: Poem) {
	const nowDate = new Date(Date.now());
	const options = {
		url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem`,
		headers: {
			Authorization: 'SIGNATURE_GOES_HERE',
			'content-type': 'application/json'
		},
		data: JSON.stringify({
			poem_name: poem.poem.name,
			poem_body: poem.poem.body,
			poem_note: poem.note,
			poem_timestamp: `${nowDate.getFullYear()}-${
				nowDate.getMonth() + 1
			}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
		})
	};
	const response = await CapacitorHttp.post(options);
	// if (response.status === 200) {
	// 	thinking = false;
	// } else {
	// 	alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
	// }
}

export function intercloudGDriveUpdatePoem() {}

export function intercloudGDriveDeletePoem() {}
