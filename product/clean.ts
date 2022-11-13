import moviesJson from "../movies.json"
import peopleJson from "../people.json"
import ratingsJson from "../ratings.json"
import starsJson from "../stars.json"
import directorsJson from "../directors.json"

const movies = moviesJson as Movie[]
const people = peopleJson as People[]
const ratings = ratingsJson as Rating[]
const stars = starsJson as Star[]
const directors = directorsJson as Director[]

export interface Movie {
  id:    number;
  title: string;
  year:  number;
}
export interface People {
  id:    string;
  name:  string;
  birth: string;
}
export interface Rating {
  movie_id: string;
  rating:   string;
  votes:    string;
}
export interface Star {
  movie_id:  string;
  person_id: string;
}
export interface Director {
  movie_id:  string;
  person_id: string;
}

const main =async () => {
  for(const rating of ratings)
  {
    const found = movies.find(i=>i.id === +rating.movie_id)
    if(!found) console.log(`Rating ${rating.movie_id}`)
  }
  for(const item of stars)
  {
    const foundPerson = people.find(i=>i.id === item.person_id)
    if(!foundPerson) console.log("Star "+item.person_id)
    
    const foundMovie = movies.find(i=>i.id === +item.movie_id)
    if(!foundMovie) console.log("Star "+item.movie_id)
  }
  for(const item of directors)
  {
    const foundPerson = people.find(i=>i.id === item.person_id)
    if(!foundPerson) console.log("Director "+item.person_id)
    
    const foundMovie = movies.find(i=>i.id === +item.movie_id)
    if(!foundMovie) console.log("Director "+item.movie_id)
  }
}

main()