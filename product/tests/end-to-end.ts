import fetch from "node-fetch"

export const baseUrl = process.env.BASE_URL ?? "https://express-1a77154-7uexe4aknq-ew.a.run.app"

const routesToCheck = [
    "/",
    "/movies",
    "/movies/6723592",
    "/toplists",
    "/user"
]


const testOkFetched = async (url: string) => {
    const res = await fetch(url)
    if(!res.ok) throw new Error(`Error calling ${url}`)
    console.log(`Success calling ${url}`)
}

const main =async () => {
    for(const route of routesToCheck)
    {
        await testOkFetched(`${baseUrl}${route}`)
    }
}

main()