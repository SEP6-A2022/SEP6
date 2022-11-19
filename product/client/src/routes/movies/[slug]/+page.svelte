<script>
    /** @type {import('./$types').PageData} */
    export let data;
  </script>
  
<h1>{data.movie.title}</h1>
<h1>Year: {data.movie.year}</h1>

<h1>Director: {data.director.name}, {data.director.birth? "Born:" + data.director.birth: ""}</h1>

<h1>Actors:</h1>
{#each data.actors as item}
    <p>{item.name} {item.birth? "Born:" + item.birth: ""}</p>
{:else}
    <p>No actors</p>
{/each}