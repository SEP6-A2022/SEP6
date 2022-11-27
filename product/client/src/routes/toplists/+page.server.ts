import { error, type LoadEvent } from '@sveltejs/kit';
import type { Load} from "@sveltejs/kit"

import { PrismaClient, type movies, type people, type ratings, type toplists } from '@prisma/client'
const prisma = new PrismaClient()
let total = -1;


/** @type {import('./$types').PageServerLoad} */
export const load : Load = async ({params}) => {
    if(total===-1)
    {
        total = await prisma.toplists.count();
    }
    const first = 15
    let skip = Math.floor(Math.random() * total);
    if(total-skip<first){
        skip = 0
    }
    const searched = await prisma.toplists.findMany({
      take: +first,
      skip: skip,
      orderBy: {
          id: 'desc',
      }
  });
    return {toplists: JSON.parse(JSON.stringify(searched)) as toplists[]}
}