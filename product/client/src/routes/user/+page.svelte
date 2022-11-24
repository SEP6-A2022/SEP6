<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    let email = ""
    let password = ""
    let password2 = ""

    let clientid = "11c2d39160e19c5d2ab0"
    import {loggedInUser, type loggedType} from "../../stores"

    onMount(()=>{

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
</script>

{#if $loggedInUser.content?.name}
    <p>Welcome back {$loggedInUser.content?.name}</p>
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
    <a href="https://github.com/login/oauth/authorize?client_id={clientid}&scope=user:email">
        <h1>Login with GitHub</h1>
    </a>

{/if}
