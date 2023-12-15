import { google } from 'googleapis';
import { env } from '$env/dynamic/private';
import { PUBLIC_POKEBOOK_BASE_URL } from '$env/static/public';

const googleClient = new google.auth.OAuth2(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	PUBLIC_POKEBOOK_BASE_URL + '/callback'
);

export default googleClient;
