import type { Handle } from '@sveltejs/kit';

import { PUBLIC_POKEBOOK_CLIENT_URL } from '$env/static/public';

const securityHeaders = {
	'Cross-Origin-Opener-Policy': 'same-origin',
	'X-XSS-Protection': '1; mode=block',
	'X-Frame-Options': 'DENY',
	'Content-Security-Policy':
		"base-uri 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'self'; frame-ancestors 'none'; form-action 'self'",
	'X-Content-Type-Options': 'nosniff'
};

const corsHeaders = {
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
	'Access-Control-Allow-Origin': PUBLIC_POKEBOOK_CLIENT_URL,
	'Access-Control-Allow-Headers': '*'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	Object.entries(securityHeaders).forEach(([header, value]) => response.headers.set(header, value));

	if (event.request.method === 'OPTIONS')
		Object.entries(corsHeaders).forEach(([header, value]) => response.headers.set(header, value));

	response.headers.append('Access-Control-Allow-Origin', PUBLIC_POKEBOOK_CLIENT_URL);

	return response;
};
