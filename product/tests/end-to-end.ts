import fetch from "node-fetch"

const homePage = "https://express-1a77154-7uexe4aknq-ew.a.run.app/"
const moviesPage = "https://express-1a77154-7uexe4aknq-ew.a.run.app/movies"
const moviePage = "https://express-1a77154-7uexe4aknq-ew.a.run.app/movies/6723592"
const toplistsPage = "https://express-1a77154-7uexe4aknq-ew.a.run.app/toplists"
const userPage = "https://express-1a77154-7uexe4aknq-ew.a.run.app/user"

const testOkFetched = async (url: string) => {
    const res = await fetch(url)
    if(!res.ok) throw new Error(`Error calling ${url}`)
    console.log(`Success calling ${url}`)
}

const main =async () => {
    await testOkFetched(homePage)
    await testOkFetched(moviesPage)
    await testOkFetched(moviePage)
    await testOkFetched(toplistsPage)
    await testOkFetched(userPage)
}

main()