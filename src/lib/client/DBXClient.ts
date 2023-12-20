import { Dropbox, DropboxAuth } from 'dropbox';

import { env } from '$env/dynamic/private';

export const dbxClient = new Dropbox({
	fetch: fetch,
	clientId: env.DROPBOX_APP_KEY,
	clientSecret: env.DROPBOX_APP_SECRET
});

export const dbxAuthClient = new DropboxAuth({
	fetch: fetch,
	clientId: env.DROPBOX_APP_KEY,
	clientSecret: env.DROPBOX_APP_SECRET
});
