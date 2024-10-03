import { Filesystem } from '@capacitor/filesystem';

const checkPermissionsAndGetFilesystemPlugin = () => {
	Filesystem.checkPermissions().then((status) => {
		if (status.publicStorage !== 'granted') {
			Filesystem.requestPermissions();
		}
	});

	return Filesystem;
};

const FilesystemWithPermissions = checkPermissionsAndGetFilesystemPlugin();

export default FilesystemWithPermissions;
