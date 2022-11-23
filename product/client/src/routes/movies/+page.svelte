<script lang="ts">
import { goto } from '$app/navigation';
let searchedMovie = ""
import { getStores, navigating, page, updated } from '$app/stores';
	import { onMount } from 'svelte';

let timeout: NodeJS.Timeout | undefined  =  undefined
let movies = []
let input: HTMLInputElement;

onMount(async ()=>{
    let title = $page.url.searchParams.get('title')
    searchedMovie =  title ? title : "" 
    await fetchMovie()
})

const fetchMovie =async () => {
    const response = await fetch(`/api/movies?title=${searchedMovie}&first=15`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });
    movies = await response.json()
}

const handleChange =async () => {

    if(timeout)
    {
        clearTimeout(timeout)
    }
    timeout = setTimeout(async() => {
        fetchMovie()
        $page.url.searchParams.set('title',searchedMovie); 
        // if enabled will set the query parameter, but unfocus the input
        // await goto(`?${$page.url.searchParams.toString()}`);
    }, 300);
}

</script>


<h1>Movies</h1>
<input placeholder="Search movie" 
type="text" bind:value={searchedMovie} bind:this={input}
on:input={handleChange}>

{#each movies as movie}
    <a href="/movies/{movie.id}">
        <p>{movie.title} {movie.year}</p>
    </a>
{:else}
     <!-- empty list -->
{/each}

<style>

</style>