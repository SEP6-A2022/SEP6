/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client'

// @ts-ignore
export async function GET({ url }) {
  try {
    const prisma = new PrismaClient()
    const res = await prisma.movies.count()
   
    return new Response(String(res));
  } catch (err) {
    return new Response(JSON.stringify({
      err,
      stack: err.stack,
      message: err.message,
    }))
  }
}