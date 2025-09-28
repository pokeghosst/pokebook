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

import { applyWSSHandler } from '@trpc/server/adapters/ws';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { WebSocketServer } from 'ws';

import routes from './routers';
import { appRouter } from './trpc/routers';
import { createContext } from './trpc/wsContext';

const wss = new WebSocketServer({
	port: 3001
});

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
app.use('/', routes);

const handler = applyWSSHandler({
	wss,
	router: appRouter,
	createContext,
	keepAlive: {
		enabled: true,
		pingMs: 30000,
		pongWaitMs: 5000
	}
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});

wss.on('connection', (ws) => {
	console.log(`Connection (${wss.clients.size})`);
	ws.once('close', () => {
		console.log(`Connection (${wss.clients.size})`);
	});
});
console.log('✅ WebSocket Server listening on ws://localhost:3001');
process.on('SIGTERM', () => {
	console.log('SIGTERM');
	handler.broadcastReconnectNotification();
	wss.close();
});
