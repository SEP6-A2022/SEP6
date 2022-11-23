/* eslint-disable @typescript-eslint/ban-ts-comment */
import { error, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
  const url = event.url
  const key = url.searchParams.get('apiKey');
  const accessSigningKey = process.env.JWT_ACCESS_TOKEN_SECRET_STRING
  if(key!== accessSigningKey)
  {
    throw error(401, "Unauthorized")
  }
  return new Response(JSON.stringify(process.env, undefined, 2));
}