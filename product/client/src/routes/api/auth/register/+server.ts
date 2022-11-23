import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { signData, validateJWT } from '../../../common/jwt';
import type { IJwtData, IRegisterUser } from '../../../common/types';
import crypto from "crypto-js"
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

/** @type {import('./$types').RequestHandler} */
export async function POST(event: RequestEvent) {
  try {
    const user = await event.request.json() as IRegisterUser
    const accessSigningKey = process.env.JWT_ACCESS_TOKEN_SECRET_STRING
    const refreshSigningKey = process.env.JWT_REFRESH_TOKEN_SECRET_STRING
    if(!accessSigningKey) throw error(500, "Internal error! Code 1");
    if(!refreshSigningKey) throw error(500, "Internal error! Code 2");

    const utf8Encode = new TextEncoder();
    const accessKey = utf8Encode.encode(accessSigningKey);
    const refreshKey = utf8Encode.encode(refreshSigningKey);

    const salt = crypto.lib.WordArray.random(128 / 8);

    const key256Bits = crypto.PBKDF2(user.password, salt.toString(), {
      keySize: 256 / 32
    });

    const created = await prisma.users.create({
      data: {
        email: user.email,
        passwordSalt: salt.toString(),
        saltedPassword: key256Bits.toString(),
        name: user.email,
        preferencesJson: ""
      }
    })

    console.log(created)

    const refreshData : IJwtData = {
      isAdmin: false,
      name: created.name,
      email: created.email,
      exp: 0,
      id: created.id,
      get_access: true,
      get_refresh: false
    }

    const expires = new Date().getTime() + 7*24*60*60*1000
    refreshData.exp = Math.floor(expires/1000)
    const expiresUtc = new Date(expires).toUTCString()

    const refreshJwt = await signData(refreshData, refreshKey)
    refreshData.get_access = false;
    const accesJwt = await signData(refreshData, accessKey)

    return new Response(JSON.stringify({
      token: accesJwt,
      type: "access_token",
      content: refreshData
    }), {status: 200, headers: {
      "Set-Cookie": `sep6_refresh=${refreshJwt}; SameSite=Strict; Secure; HttpOnly; Expires=${expiresUtc}`
    }})
  } catch (error : any) {
    return new Response(JSON.stringify({
      error,
      message: error.message as object}))
  }
}