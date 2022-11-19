<script lang="ts">
import { goto } from '$app/navigation';
let searchedMovie = ""
import { getStores, navigating, page, updated } from '$app/stores';
	import { onMount } from 'svelte';

let timeout: NodeJS.Timeout | undefined  =  undefined
let movies = []

onMount(async ()=>{
    let title = $page.url.searchParams.get('title')
    searchedMovie =  title ? title : "" 
    fetchMovie()
})

const fetchMovie =async () => {
    const response = await fetch(`/api/movies?title=${searchedMovie}&first=10`, {
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
        $page.url.searchParams.set('title',searchedMovie); 
        goto(`?${$page.url.searchParams.toString()}`);
        fetchMovie()
    }, 500);
}
</script>


<h1>Movies</h1>
<input placeholder="Search movie" type="text" bind:value={searchedMovie} on:input={handleChange}>

{#each movies as movie}
    <a href="/movies/{movie.id}">
        <p>{movie.title} {movie.year}</p>
    </a>
{:else}
     <!-- empty list -->
{/each}

<style>

</style>