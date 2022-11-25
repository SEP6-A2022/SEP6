<script lang="ts">
    import {flip} from 'svelte/animate';
    import type {PageData} from "./$types"
    export let data: PageData
    import {loggedInUser, type loggedType} from "../../../stores"
	  import type { movies, toplists } from '@prisma/client';
    import { goto } from '$app/navigation';
    let searchedMovie = ""
    import { getStores, navigating, page, updated } from '$app/stores';
    import { onMount } from 'svelte';

    let timeout: NodeJS.Timeout | undefined  =  undefined
    let movies: movies[] = []
    let input: HTMLInputElement;

    const addToToplist =async (id:number) => {
      if(data.movies.find(m=>m.id===id))
      {
        return
      }
      data.movies.push(movies.find(m=>m.id===id))
      data.movies = data.movies
      movies = movies.filter(m=>m.id!==id)
      saveChanges()
    }
    const removeFromToplist =async (id:number) => {
      data.movies = data.movies.filter(m=>m.id!==id)
      data.movies = data.movies
      saveChanges()
    }

    const fetchMovie =async () => {
        const response = await fetch(`/api/movies?title=${searchedMovie}&first=5`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        const temp = await response.json() as movies[]
        movies = temp.filter(m=>!getIds(data.movies).includes(m.id))
    }

    const handleChange =async () => {
        if(searchedMovie==="")
        {
          movies = []
          return
        }
        if(timeout)
        {
            clearTimeout(timeout)
        }
        timeout = setTimeout(async() => {
            fetchMovie() 
        }, 300);
    }

    let draggable = false
    loggedInUser.subscribe((value)=>{
      draggable = (value.content?.id === data.toplist.authorId) ? true : false
    })
    let hovering = -1;

    const drop = (event: DragEvent, target: number) => {
        if(!event.dataTransfer)
        {
            return
        }
        event.dataTransfer.dropEffect = 'move'; 
        const start = parseInt(event.dataTransfer.getData("text/plain"));
        const newTracklist = data.movies
    
        if (start < target) {
            newTracklist.splice(target + 1, 0, newTracklist[start]);
            newTracklist.splice(start, 1);
        } else {
            newTracklist.splice(target, 0, newTracklist[start]);
            newTracklist.splice(start + 1, 1);
        }
        data.movies = newTracklist
        hovering = -1
        saveChanges();
    }

    const getIds = (movies: movies[]) => {
      const ids : number[] = []
      for(const movie of movies)
      {
        ids.push(movie.id)
      }
      return ids
    }

    const saveChanges =async () => {
      const ids= getIds(data.movies)
      const changed : toplists = {
        id: data.toplist.id,
        name: data.toplist.name,
        moviesJson: JSON.stringify(ids),
        authorId: 0
      }
      console.log(changed)
      const response = await fetch(`/api/toplists`, {
        method: 'PUT',
        body: JSON.stringify(changed),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${$loggedInUser.token}`
        }
        });
      const res = await response.json()
      console.log(res)
    }
  
    const dragstart = (event: DragEvent, i: number) => {
        if(!event.dataTransfer)
        {
            return
        }
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        const start = i;
        event.dataTransfer.setData('text/plain', start+"");
    }
  
    export const deleteToplist =async () => {
      const yes = confirm("Are you sure ?")
      if(!yes) return
      const response = await fetch(`/api/toplists?id=${data.toplist.id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${$loggedInUser.token}`
        }
        });
      if(response.ok)
      {
        alert("Deleted!")
        goto("/toplists")
      }
    }

  </script>

  {#if draggable}
    <button on:click={()=>{deleteToplist()}}>delete toplist</button>
  {/if}
  <h1 contenteditable="true" bind:textContent={data.toplist.name} on:blur={()=>saveChanges()}>{data.toplist.name}</h1>
  <div class="list">
    {#each  data.movies as n, index  (n.title+Math.random())}
      <div
               class="list-item" 
         animate:flip
         draggable={draggable} 
         on:dragstart={event => dragstart(event, index)}
         on:drop|preventDefault={event => drop(event, index)}
         on:dragover|preventDefault
         on:dragenter={() => hovering = index}
         class:is-active={hovering === index}>
         <a href="/movies/{n.id}">{index+1}. {n.title}</a>
         {#if draggable}
         <button on:click={()=>removeFromToplist(n.id)}>remove</button>
        {/if}
        </div>
    {/each}
  </div>

{#if draggable}
<input placeholder="Search movie" 
type="text" bind:value={searchedMovie} bind:this={input}
on:input={handleChange}>

{#each movies as movie}
        <p>{movie.title} {movie.year} <button on:click={()=>addToToplist(movie.id)}>add</button> </p>
{:else}
     <!-- empty list -->
{/each}
{/if}

  <!-- {JSON.stringify(data.toplist)}
  {JSON.stringify($loggedInUser.content)} -->
  
<style>
  .list {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  }

  .list-item {
    display: block;
    padding: 0.5em 1em;
  }

  .list-item:not(:last-child) {
    border-bottom: 1px solid #dbdbdb;
  }

  .list-item.is-active {
    background-color: #3273dc;
    color: #fff;
  }
</style>