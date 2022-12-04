import { error } from '@sveltejs/kit';
import type { Load} from "@sveltejs/kit"

import { PrismaClient, type movies, type people, type ratings } from '@prisma/client'
import type { IMovieAPIresponse } from 'src/routes/common/types';
const prisma = new PrismaClient()
const apiKey = process.env.OMDB_API_KEY

export interface IMovieDescription {
    image: string,
    plot: string
}

/** @type {import('./$types').PageServerLoad} */
export const load : Load = async ({ params }) => {
    if(!apiKey)
    {
        throw error(500, "Internal error #1")
    }
    let movieId = params.slug as string
    movieId = movieId.replaceAll("t", "")
    const isnum = /^\d+$/.test(movieId);
    if(!isnum)
    {
        throw error(406, `Only numeric movie id's (with or without tt) are accepted, got "${movieId}"`);
    }
    
    while(movieId.startsWith("0"))
    {
        movieId = movieId.substring(1, movieId.length)
    }
    

    let movie =  await prisma.movies.findFirst({
        where : {
            id: +movieId
        }
    })
    if(movie)
    {
        let id = movieId;
        while(id.length<8)
        {
            id= "0"+id
        }
        if(!movie.description.includes("https://") || movie.description.includes("plot\":\"\""))
        {
            console.log(id)
            const response = await fetch(`https://www.omdbapi.com/?i=tt${id}&plot=full&apikey=${apiKey}`)
            if(response.ok)
            {
                const res = await response.json() as IMovieAPIresponse
                // console.log(res)
                const movieDescription : IMovieDescription = {
                    image: "",
                    plot: ""
                }
                if(res.Plot.length>5) movieDescription.plot = res.Plot
                if(res.Poster.includes("https")) movieDescription.image = res.Poster
                    movie = await prisma.movies.update({
                        where: {
                            id: movie.id
                        },
                        data: {
                            description: JSON.stringify(movieDescription)
                        }
                    })
                console.log(movieDescription)
            }
        }

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
        const rating = await prisma.ratings.findFirst({
            where: {
                movie_id: movie.id
            }
        })

        return {
            movie: JSON.parse(JSON.stringify(movie)) as movies,
            actors: JSON.parse(JSON.stringify(actors)) as people[],
            director: JSON.parse(JSON.stringify(dirPerson)) as people,
            rating: JSON.parse(JSON.stringify(rating)) as ratings,
            description: JSON.parse(movie.description) as IMovieDescription
        }
        
    }
 
    throw error(404, 'Not found');
}