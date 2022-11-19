import { error } from '@sveltejs/kit';
 
import { PrismaClient, type movies, type people } from '@prisma/client'
const prisma = new PrismaClient()

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const title = url.searchParams.get('title');
  if(!title)
  {
    return new Response(JSON.stringify([]))
  }

  const searched = await prisma.movies.findMany({
    take: 15,
    where: {
        title: {
            contains: title,
            mode: 'insensitive'
        },
    },
  })
  console.log(searched)
 
  return new Response(JSON.stringify(searched));
}