import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { signData, validateJWT } from '../../../common/jwt';

/** @type {import('./$types').RequestHandler} */
export async function POST(event: RequestEvent) {
  return new Response(undefined, {status: 204, headers: {
    "Set-Cookie": `sep6_refresh=""; SameSite=Strict; Secure; HttpOnly;`
  }})
}