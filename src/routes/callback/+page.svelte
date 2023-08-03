<script>
	import { page } from '$app/stores';
	import { Preferences } from '@capacitor/preferences';

	const status = $page.url.searchParams.get('status');
	let message;

	switch (status) {
		case 'success':
			Preferences.set({
				key: 'storage_mode',
				value: 'gdrive'
			});
			Preferences.set({
				key: 'gdrive_auth',
				value: 'true'
			});
			message = 'You have sucessfully authorized Google Drive! Now go write some poems!';
			break;
		case 'access_denied':
			message =
				'Looks like some access problem. Maybe you cancelled authorization? Go to Settings and try again!';
			Preferences.set({
				key: 'storage_mode',
				value: 'local'
			});
			break;
		case 'unknown':
			message =
				'OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!';
			Preferences.set({
				key: 'storage_mode',
				value: 'local'
			});
			break;
	}
</script>

<div class="text-center mt-10 mx-10">
	{message}
</div>
