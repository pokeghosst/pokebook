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

import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';

import { getGoogleAuthUrl, processCallback } from '../services/google-auth.service';
import { createSession } from '../services/redis.service';

import type { gaxios } from 'google-auth-library';

export const getOAuthUrl = (req: Request, res: Response) => {
	const { provider } = req.params;

	switch (provider) {
		case 'google':
			res.redirect(getGoogleAuthUrl());
	}
};

export const handleCallback = async (req: Request, res: Response) => {
	const { provider } = req.params;
	const sessionId = randomBytes(32).toString('hex');

	switch (provider) {
		case 'google':
			const { code } = req.query;

			if (code && typeof code === 'string') {
				try {
					const callbackResult = await processCallback(code);

					if (
						!callbackResult.refreshToken ||
						!callbackResult.accessToken ||
						!callbackResult.expiresAt
					)
						throw new Error('callback');

					if ((await createSession(sessionId, callbackResult)) === null)
						res.redirect(`${process.env.CLIENT_URL}/?auth=err_session_save`);

					res.cookie('pokebook-session', sessionId, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'strict',
						maxAge: 30 * 24 * 60 * 60 * 1000, // TODO: Reflect this expiration in Redis (auto-delete) and/or extend maxAge
						path: '/'
					});

					res.redirect(`${process.env.CLIENT_URL}/?auth=success`);
				} catch (e: unknown) {
					// TODO: Proper error handling/logging?
					console.error(e);

					if ((e as gaxios.GaxiosError).response?.data?.error === 'invalid_grant') {
						res.redirect(`${process.env.CLIENT_URL}/?auth=invalid_grant`);
					} else {
						if (e instanceof Error) {
							switch (e.message) {
								case 'callback':
									res.redirect(`${process.env.CLIENT_URL}/?auth=callback_error`);
									break;
							}
							res.redirect(`${process.env.CLIENT_URL}/?auth=unknown`);
						}
					}
				}
			}
	}
};
