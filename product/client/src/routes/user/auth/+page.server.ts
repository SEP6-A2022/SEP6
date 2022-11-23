import { error } from '@sveltejs/kit';
import type { Load} from "@sveltejs/kit"

import { PrismaClient, type movies, type people, type ratings } from '@prisma/client'
import type { IJwtData, ITokenResponse, IUserResponse } from 'src/routes/common/types';
import { signData } from '../../common/jwt';

const prisma = new PrismaClient()

/** @type {import('./$types').PageServerLoad} */
export const load: Load = async ({ params, url }) => {
    const code = url.searchParams.get("code")
    const secret = process.env.GITHUB_OAUTH_SECRET
    const client_id = process.env.GITHUB_CLIENT_ID
    const accessSigningKey = process.env.JWT_ACCESS_TOKEN_SECRET_STRING

    if(!secret) throw error(500, "Internal error. Code 1")
    if(!client_id) throw error(500, "Internal error. Code 2")
    if(!code) throw error(404, "Code not found in the request! Code 3");
    if(!accessSigningKey) throw error(500, "Internal error! Code 4");

    const admins = ["me@ddlele.com"]

    const utf8Encode = new TextEncoder();
    const key = utf8Encode.encode(accessSigningKey);
    
    const accessRequest = await fetch(`https://github.com/login/oauth/access_token?client_secret=${secret}&client_id=${client_id}&code=${code}`, {
        headers: {
          Accept: "application/json"
        },
        method: "POST"
    })
    if(!accessRequest.ok) throw error(404, "Bad oauth code")

    const token = await accessRequest.json() as ITokenResponse

    const userInfo = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token.access_token}`
        }
      })
    const userData = await userInfo.json() as IUserResponse

    if(userInfo.ok || !userData)
    {
        if(!accessSigningKey) throw error(500, "Cannot retreive user info! Code 5");
    }

    let user = await prisma.users.findFirst({
        where: {
            email: userData.email
        }
    })

    if(!user)
    {
        console.log("User not found!")
        user = await prisma.users.create({
            data: {
                email: userData.email,
                name: userData.login,
                preferencesJson: JSON.stringify({}),
                saltedPassword: "",
                passwordSalt: ""
            }
        })
    }
    const userJwt : IJwtData = {
        email: user.email,
        name: user.name,
        id: user.id,
        isAdmin: admins.includes(user.email),
        get_refresh: true,
        get_access: false,
        exp: Math.floor(new Date().getTime() / 1000) + 300
    }

    const jwt = await signData(userJwt, key)

    return {
        key: jwt
    }
}