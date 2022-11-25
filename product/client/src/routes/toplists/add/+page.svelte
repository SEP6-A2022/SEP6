<script lang="ts">
	import { goto } from '$app/navigation';
 import type { movies, toplists } from '@prisma/client';
import {loggedInUser} from "../../../stores"
let toplistName = ""
const createToplist =async () => {
    if(toplistName.length<3)
    {
        return
    }
    const changed = {
        name: toplistName,
        moviesJson: "[]",
      }
      console.log(changed)
      const response = await fetch(`/api/toplists`, {
        method: 'POST',
        body: JSON.stringify(changed),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${$loggedInUser.token}`
        }
        });
      const res = await response.json() as toplists
      goto(`/toplists/${res.id}`)
}
</script>

<input type="text" placeholder="toplist name" bind:value={toplistName}>
<button on:click={()=>createToplist()}>Create</button>