<script>
    /** @type {import('./$types').PageData} */
    export let data;
  </script>
  
<h1>{data.movie.title} {data.movie.year}</h1>
<h1>Rating: {data.rating ? `${data.rating.rating} based on ${data.rating.votes} votes` : "not rated" }</h1>
<h1>Director: {data.director.name} {data.director.birth? "Born: " + data.director.birth: ""}</h1>

<h1>Actors:</h1>
{#each data.actors as item}
    <p>{item.name}{item.birth? ", born: " + item.birth: ""}</p>
{:else}
    <p>No actors</p>
{/each}