import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { signData, validateJWT } from '../../../common/jwt';

/** @type {import('./$types').RequestHandler} */
export async function GET(event: RequestEvent) {
  const refreshCookie = event.cookies.get("sep6_refresh")

  const accessSigningKey = process.env.JWT_ACCESS_TOKEN_SECRET_STRING
  const refreshSigningKey = process.env.JWT_REFRESH_TOKEN_SECRET_STRING
  if(!accessSigningKey) throw error(500, "Internal error! Code 1");
  if(!refreshSigningKey) throw error(500, "Internal error! Code 2");

  const utf8Encode = new TextEncoder();
  const accessKey = utf8Encode.encode(accessSigningKey);
  const refreshKey = utf8Encode.encode(refreshSigningKey);

  if(!refreshCookie)
  {
    throw error(401, "Unauthorized. 1")
  }

  const data = await validateJWT(refreshCookie, refreshKey)

  if(!data)
  {
    throw error(401, "Unauthorized. 3")
  }

  if(!data.get_access)
  {
    throw error(403, "Forbidden")
  }

  data.get_access = false;
  data.get_refresh = false;
  const expires = new Date().getTime() + 1*60*60*1000
  data.exp = Math.floor(expires/1000)

  const jwt = await signData(data, accessKey)

  return new Response(JSON.stringify({
    token: jwt,
    type: "access_token",
    content: data
  }), {status: 200})
}