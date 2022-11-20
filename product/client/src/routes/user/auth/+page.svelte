
<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { loggedInUser } from "../../../stores";
/** @type {import('./$types').PageData} */
export let data;
// use the data to send request to api to get refresh / access token
// refresh token = http only cookie
// access token = svelte store

const fetchRefreshToken =async () => {
    await fetch(`/api/auth/refresh`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${data.key}`
        }
    });
    
}

onMount(async()=>{
    await fetchRefreshToken()
    await goto("/user")
})

</script>

<h1>You are logged in</h1>
{#if data}
     <!-- content here -->
<p>{JSON.stringify(data)}</p>
<p>{JSON.stringify($loggedInUser)}</p>

{/if}