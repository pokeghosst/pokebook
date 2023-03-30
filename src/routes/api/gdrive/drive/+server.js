import { generateCredentials } from "$lib/server/gdrive";
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const jsonRequest = await request.json()
    const responseBody = await generateCredentials(jsonRequest.authCode)
    return json(responseBody)
}