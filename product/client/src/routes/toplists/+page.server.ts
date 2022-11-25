import { error, type LoadEvent } from '@sveltejs/kit';
import type { Load} from "@sveltejs/kit"

import { PrismaClient, type movies, type people, type ratings, type toplists } from '@prisma/client'
const prisma = new PrismaClient()

const total = await prisma.toplists.count();

/** @type {import('./$types').PageServerLoad} */
export const load : Load = async ({params}) => {
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