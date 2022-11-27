import { error, type LoadEvent } from '@sveltejs/kit';
import type { Load} from "@sveltejs/kit"

import { PrismaClient, type movies, type people, type ratings } from '@prisma/client'
const prisma = new PrismaClient()

/** @type {import('./$types').PageServerLoad} */
export const load : Load = async ({params}) => {
    if(!params.slug )
    {
        throw error(404)
    }
    const toplistId = +params.slug

    const toplist = await prisma.toplists.findFirst({
        where: {
            id: toplistId
        }
    })

    if(!toplist?.moviesJson)
    {
        throw error(500, "No content found!")
    }
    const movieIds = JSON.parse(toplist?.moviesJson)
    const movies: object[] = []
    for(const movieId of movieIds)
    {
        const one = await prisma.movies.findFirst({
            where: {
                id: movieId
            },
            include: {
                ratings: true
            }
        })
        if(one)
        {
            movies.push(one)
        }
    }
    return { 
        toplist,
        movies: JSON.parse(JSON.stringify(movies))}
}