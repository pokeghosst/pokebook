/*
@pokebook/core - PokeBook core types and logic
Copyright (C) 2025 Pokeghost.

@pokebook/core is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

@pokebook/core is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { $ } from "bun";

const run = async () => {
  await Promise.all([$`bun run ts:dev`, $`bun run res:dev`]);
};

run();
