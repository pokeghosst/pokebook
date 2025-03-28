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

import type { Request, Response } from 'express';
import { getGoogleAuthUrl, processCallback } from '../services/google-auth.service';

export const getOAuthUrl = (req: Request, res: Response) => {
	const { provider } = req.params;

	switch (provider) {
		case 'google':
			res.redirect(getGoogleAuthUrl());
	}
};

export const handleCallback = async (req: Request, res: Response) => {
	const { provider } = req.params;

	switch (provider) {
		case 'google':
			const { code } = req.query;

			if (code && typeof code === 'string') {
				try {
					const { accessToken, expiresAt, sessionId } = await processCallback(code);

					res.cookie('pokebook-session', JSON.stringify({ accessToken, expiresAt, sessionId }), {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						maxAge: 30 * 24 * 60 * 60 * 1000,
						path: '/'
					});

					res.redirect(`${process.env.CLIENT_URL}/?auth=success`);
				} catch (e) {
					if (e.response?.data?.error === 'invalid_grant') {
						res.redirect(`${process.env.CLIENT_URL}/?auth=invalid_grant`);
					} else {
						res.redirect(`${process.env.CLIENT_URL}/?auth=unknown`);
					}
				}
			}
	}
};
