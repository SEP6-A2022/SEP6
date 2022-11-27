import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { signData, validateJWT } from '../common/jwt';

export const validateAuthHeader =async (event: RequestEvent) => {
    const authHeader = event.request.headers.get("Authorization")
    const accessSigningKey = process.env.JWT_ACCESS_TOKEN_SECRET_STRING
    const refreshSigningKey = process.env.JWT_REFRESH_TOKEN_SECRET_STRING
    if(!accessSigningKey) throw error(500, "Internal error! Code 1");
    if(!refreshSigningKey) throw error(500, "Internal error! Code 2");
  
    const utf8Encode = new TextEncoder();
    const accessKey = utf8Encode.encode(accessSigningKey);
  
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
    return data
  }