<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	  import type { movies, toplists } from '@prisma/client';

    let email = ""
    let password = ""
    let password2 = ""

    let toplists: toplists[] = []

    let clientid = "11c2d39160e19c5d2ab0"
    import {loggedInUser, type loggedType} from "../../stores"

    onMount(async()=>{
        
    })


    loggedInUser.subscribe(async(v)=>{
        if(!v.content)
        {
            return
        }
        const response = await fetch(`/api/toplists?userId=${v.content.id}`, {
        method: 'GET',
        });
      const res = await response.json() as toplists[]
      toplists = res
    })

    const loginUser = async ()=>
    {
        const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(
            {
                email,
                password
            }
        ),
        headers: {
            'content-type': 'application/json'
        }
        });
        if(!response.ok)
        {
            alert("Error during login!")
        }
		const res = await response.json() as loggedType
		loggedInUser.set(res)
    }
    const signUp = async ()=>
    {
        if(password!==password2)
        {
            alert("Passwords must match!")
        }
        const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify(
            {
                email,
                password
            }
        ),
        headers: {
            'content-type': 'application/json'
        }
        });
        if(!response.ok)
        {
            alert("Error during registration!")
        }
		const res = await response.json() as loggedType
		loggedInUser.set(res)
    }
    let login = true

    const logout =async () => {
        const response = await fetch(`/api/auth/logout`, {
        method: 'POST',
        });
        if(!response.ok)
        {
            alert("Error during registration!")
            return
        }
        loggedInUser.set({
            content: undefined,
            token: undefined
        })
    }
</script>

{#if $loggedInUser.content?.name}
    <h1>Welcome back {$loggedInUser.content?.name}</h1>
    <button on:click={()=>logout()}>Logout</button>
    <h2>Your toplists:</h2>
    {#each toplists as toplist}
         <a href="/toplists/{toplist.id}"><h3>{toplist.name}</h3></a>
    {/each}
    <a href="/toplists/add"><button>add</button></a>
    {:else}
    <button on:click={()=>{login=!login}}>Login/Sign Up</button>
    <input bind:value={email} type="text" placeholder="Email">
    <input bind:value={password} type="password" placeholder="Password">
    {#if login}
        <button on:click={()=>loginUser()}>Login</button>
    {:else}
        <input bind:value={password2} type="password" placeholder="Repeat Password">
        <button on:click={()=>signUp()}>Sign Up</button>
    {/if}
    <a href="https://github.com/login/oauth/authorize?client_id={clientid}">
        <h1>Login with GitHub</h1>
    </a>

{/if}
