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

import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

import { createContext } from './context';
import { appRouter, type AppRouter } from './router';

export function createServer() {
	const port = 3000;

	const server = fastify({
		maxParamLength: 5000
	});

	server
		.register(cors, {
			// TODO: For the love of all that is holy, DON'T FORGET TO ADD PRODUCTION HOST
			origin: 'http://localhost:5173',
			allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
			credentials: true,
			methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE']
		})
		.register(cookie, {
			secret: 'CHANGE_ME',
			hook: 'onRequest',
			parseOptions: {}
		})
		.register(fastifyTRPCPlugin, {
			prefix: '/trpc',
			trpcOptions: {
				router: appRouter,
				createContext,
				onError({ path, error }) {
					// report to error monitoring
					console.error(`Error in tRPC handler on path '${path}':`, error);
				}
			} satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
		});

	const stop = () => server.close();
	const start = async () => {
		try {
			await server.listen({ host: '0.0.0.0', port });
			console.log('Server listening on port', port, 'at 0.0.0.0');
		} catch (err) {
			server.log.error(err);
			process.exit(1);
		}
	};

	return { server, start, stop };
}

// (async () => {
// 	try {
// 		await server.listen({ port: 3000 });
// 	} catch (err) {
// 		server.log.error(err);
// 		process.exit(1);
// 	}
// })();
