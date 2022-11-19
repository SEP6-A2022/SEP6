import { error } from '@sveltejs/kit';
 
import { PrismaClient, type movies, type people } from '@prisma/client'
const prisma = new PrismaClient()
const total = await prisma.movies.count();


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const title = url.searchParams.get('title');
  const first = url.searchParams.get('first');
  const isnum = /^\d+$/.test(first);

  if(title)
  {
    const searched = await prisma.movies.findMany({
      take: (isnum && first) ? +first : 15,
      where: {
          title: {
              contains: title,
              mode: 'insensitive'
          },
      },
    })
    return new Response(JSON.stringify(searched));
  }
  
  if(first)
  {
    if(!isnum)
    {
        throw error(406, 'First should be a number');
    }
    const skip = Math.floor(Math.random() * total);
    const searched = await prisma.movies.findMany({
      take: +first,
      skip: skip,
      orderBy: {
          id: 'desc',
      },
  });
   
    return new Response(JSON.stringify(searched));
  }

  return new Response(JSON.stringify([]))
}