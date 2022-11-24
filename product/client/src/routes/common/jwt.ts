import * as jose from 'jose'
import type { IJwtData } from './types'


export const signData = async (data: IJwtData, key: Uint8Array) => {
    return await new jose.CompactSign(
         new TextEncoder().encode(JSON.stringify(data)),
       )
         .setProtectedHeader({ alg: "HS256" })
         .sign(key)
 }

export const validateJWT =async (jwt:string, key: Uint8Array): Promise<IJwtData | undefined> => {
    try {
        const res = await jose.compactVerify(jwt, key, {
        })

        const data = JSON.parse(res.payload.toString()) as IJwtData
        if(data.exp*1000 < new Date().getTime())
        {
            throw new Error("Token expired")
        }
        return data
    } catch (error) {
        console.log(error)
        return undefined
    }
    
}