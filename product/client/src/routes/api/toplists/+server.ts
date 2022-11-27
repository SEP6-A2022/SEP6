import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { validateAuthHeader} from '../util';
import { PrismaClient, type toplists } from '@prisma/client';
const prisma = new PrismaClient()


/** @type {import('./$types').RequestHandler} */
export async function POST(event: RequestEvent) {
  const toplist = await event.request.json() as toplists
  const jwtContent = await validateAuthHeader(event)

  const created = await prisma.toplists.create({
    data: {
      ...toplist,
      authorId: jwtContent.id
    }
  })

  return new Response(JSON.stringify(created), {status: 201})
}

export async function GET(event: RequestEvent) {
  try {
  const userId = event.url.searchParams.get("userId")
  if(!userId) throw error(400);

  const found = await prisma.toplists.findMany({
    where: {
      authorId : +userId
    }
  })
  return new Response(JSON.stringify(found), {status: 200})

  } catch (err) {
    console.log(err)
    throw error(500)
  }

}

/** @type {import('./$types').RequestHandler} */
export async function PUT(event: RequestEvent) {
  const toplist = await event.request.json() as toplists

  const jwtContent = await validateAuthHeader(event)

  const created = await prisma.toplists.update({
    where: {
      id: toplist.id
    },
    data: {
      ...toplist,
      authorId: jwtContent.id
    }
  })


  return new Response(JSON.stringify(created), {status: 201})
}

export async function DELETE(event: RequestEvent) {
  const toDeleteId = event.url.searchParams.get("id")
  if(!toDeleteId)
  {
    throw error(400)
  }

  const jwtContent = await validateAuthHeader(event)

  const created = await prisma.toplists.findFirst({
    where: {
      id: +toDeleteId
    }
  })

  if(created?.authorId!== jwtContent.id)
  {
    throw error(403)
  }

  const deleted = await prisma.toplists.delete({
    where: {
      id: +toDeleteId
    }
  })


  return new Response(JSON.stringify(deleted), {status: 200})

}