import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { signData, validateJWT } from '../../../common/jwt';

/** @type {import('./$types').RequestHandler} */
export async function GET(event: RequestEvent) {
  const authHeader = event.request.headers.get("Authorization")

  const accessSigningKey = process.env.JWT_ACCESS_TOKEN_SECRET_STRING
  const refreshSigningKey = process.env.JWT_REFRESH_TOKEN_SECRET_STRING
  if(!accessSigningKey) throw error(500, "Internal error! Code 1");
  if(!refreshSigningKey) throw error(500, "Internal error! Code 2");

  const utf8Encode = new TextEncoder();
  const accessKey = utf8Encode.encode(accessSigningKey);
  const refreshKey = utf8Encode.encode(refreshSigningKey);

  if(!authHeader)
  {
    throw error(401, "Unauthorized. 1")
  }
  const token = authHeader.split(" ")[1]
  if(!token)
  {
    throw error(401, "Unauthorized. 2")
  }

  const data = await validateJWT(token, accessKey)

  if(!data)
  {
    throw error(401, "Unauthorized. 3")
  }

  if(!data.get_refresh)
  {
    throw error(403, "Forbidden")
  }

  data.get_access = true;
  data.get_refresh = false;
  const expires = new Date().getTime() + 7*24*60*60*1000
  data.exp = Math.floor(expires/1000)
  const expiresUtc = new Date(expires).toUTCString()

  const jwt = await signData(data, refreshKey)

  return new Response(undefined, {status: 204, headers: {
    "Set-Cookie": `sep6_refresh=${jwt}; SameSite=Strict; Secure; HttpOnly; Expires=${expiresUtc}`
  }})
}