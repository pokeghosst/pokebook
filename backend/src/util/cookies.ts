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

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

interface CookieData {
	accessToken: string | null;
	expiresAt: number | null;
	sessionId: string | null;
}

export function encryptCookie(data: CookieData): string {
	const key = Buffer.from(process.env.COOKIE_ENCRYPTION_KEY!, 'base64');
	const iv = randomBytes(16);

	const cipher = createCipheriv('aes-256-gcm', key, iv);
	cipher.setAAD(Buffer.from('pokebook-session', 'utf8'));

	const jsonData = JSON.stringify(data);
	let encrypted = cipher.update(jsonData, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	const authTag = cipher.getAuthTag();

	// Format: iv.authTag.encryptedData
	return `${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted}`;
}

export function decryptCookie(encryptedData: string): CookieData | null {
	try {
		const key = Buffer.from(process.env.COOKIE_ENCRYPTION_KEY!, 'base64');
		const [ivHex, authTagHex, encrypted] = encryptedData.split('.');

		if (!ivHex || !authTagHex || !encrypted) {
			return null;
		}

		const iv = Buffer.from(ivHex, 'hex');
		const authTag = Buffer.from(authTagHex, 'hex');

		const decipher = createDecipheriv('aes-256-gcm', key, iv);
		decipher.setAAD(Buffer.from('pokebook-session', 'utf8'));
		decipher.setAuthTag(authTag);

		let decrypted = decipher.update(encrypted, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return JSON.parse(decrypted);
	} catch (error) {
		console.error('Cookie decryption failed:', error);
		return null;
	}
}
