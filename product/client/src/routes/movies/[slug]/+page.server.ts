import { error } from '@sveltejs/kit';

import { PrismaClient, type movies, type people } from '@prisma/client'
const prisma = new PrismaClient()

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    let movieId = params.slug as string
    movieId = movieId.replaceAll("t", "")
    const isnum = /^\d+$/.test(movieId);
    if(!isnum)
    {
        throw error(404, 'Only numeric ids accepted');
    }
    
    while(movieId.startsWith("0"))
    {
        movieId = movieId.substring(1, movieId.length)
    }

    const movie =  await prisma.movies.findFirst({
        where : {
            id: +movieId
        }
    })
    if(movie)
    {
        const director = await prisma.directors.findFirst({
            where: {
                movie_id: movie.id
            }
        })
        const dirPerson = await prisma.people.findFirst({
            where: {
                id: director?.person_id
            }
        })
        const actorsIds = await prisma.stars.findMany({
            where: {
                movie_id: movie.id
            }
        })
        const actors : people[] = []
        for(const id of actorsIds)
        {
            const actor = await prisma.people.findFirst({
                where: {
                    id: id.person_id
                }
            })
            if(actor)
            {
                actors.push(actor)
            }
        }
        // console.log(movie)
        // console.log(dirPerson)
        // console.log(actors)
        return {
            movie: JSON.parse(JSON.stringify(movie)) as movies,
            actors: JSON.parse(JSON.stringify(actors)) as people[],
            director: JSON.parse(JSON.stringify(dirPerson)) as people,
        }
        
    }
 
    throw error(404, 'Not found');
}