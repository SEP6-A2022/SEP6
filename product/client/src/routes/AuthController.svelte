<script lang="ts">
	import { type loggedType, loggedInUser } from "../stores";
	import { onMount } from "svelte";
	

const fetchAccessToken =async () => {
		const response = await fetch(`/api/auth/access`, {
        method: 'GET'
    });
    if(response.ok)
    {
		const res = await response.json() as loggedType
		console.log(res)
		loggedInUser.set(res)
    } else 
	{
		setTimeout(async () => {
			await fetchAccessToken()
		}, 1000);
	}
	
}

onMount(async()=>{
    await fetchAccessToken()
})

</script>
