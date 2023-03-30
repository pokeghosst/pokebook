import { getAuthUrl } from '$lib/server/gdrive'
import { json } from '@sveltejs/kit';

export function GET() {
	return json(getAuthUrl());
}
