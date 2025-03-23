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

import * as trpcExpress from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import routes from './routers';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/routers';

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173',
		allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
		credentials: true,
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE']
	})
);
app.use(cookieParser());
app.use(
	'/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext
	})
);
app.use('/', routes);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
