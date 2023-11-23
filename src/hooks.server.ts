import type { Handle } from '@sveltejs/kit';

const securityHeaders = {
	'Cross-Origin-Opener-Policy': 'same-origin',
	'X-XSS-Protection': '1; mode=block',
	'X-Frame-Options': 'DENY',
	'Content-Security-Policy':
		"base-uri 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'self'; frame-ancestors 'none'; form-action 'self'",
	'X-Content-Type-Options': 'nosniff'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	Object.entries(securityHeaders).forEach(([header, value]) => response.headers.set(header, value));

	return response;
};
