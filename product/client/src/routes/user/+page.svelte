<script>
	import { onMount } from "svelte";


    let clientid = "11c2d39160e19c5d2ab0"
    import {loggedInUser} from "../../stores"
    
    onMount(()=>{
        
    })
</script>

{#if $loggedInUser.content?.name}
    <p>Welcome back {$loggedInUser.content?.name}</p>
    {:else}
    <a href="https://github.com/login/oauth/authorize?client_id={clientid}&scope=user:email">
        <h1>Login with GitHub</h1>
    </a>
    
{/if}
