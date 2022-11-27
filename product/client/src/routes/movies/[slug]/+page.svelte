<script>
    /** @type {import('./$types').PageData} */
    export let data;
  </script>
  
<h1>{data.movie.title} {data.movie.year}</h1>

<div class="flex flex-row space-around">
    <div class="img">
        <img src="{data.description.image}" alt="No image">
    </div>
    <div class="data">
        <h1>{data.rating ? `${data.rating.rating}/10 , ${data.rating.votes} votes` : "not rated" }</h1>

        <h2>{data.description.plot}</h2>
        
        <div class="">
            <div class="flex flex-row space-between">
                <div class="row">
                    <h2>Director:</h2>
                    <p>{data.director.name} {data.director.birth? "Born: " + data.director.birth: ""}</p>
                </div>
                <div class="row">
                    <h2>Actors:</h2>
                    {#each data.actors as item}
                        <p>{item.name}{item.birth? ", born: " + item.birth: ""}</p>
                    {:else}
                        <p>No actors</p>
                    {/each}
                </div>
            </div>
            
        </div>
    </div>
</div>

<style>
    .flex{
        display: flex;
    }
    .flex-col {
        flex-direction: column;
    }
    .flex-row {
        flex-direction: row;
    }
    .img {
        min-width: 50%;
        text-align: center;
    }

    .center{
        text-align: center;
    }
    .space-around {
        justify-content: space-around;
    }
    .space-between {
        justify-content: space-between;
    }
    .flex > div {
        width: 100%
    }
</style>