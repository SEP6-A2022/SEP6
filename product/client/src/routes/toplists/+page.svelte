<script lang="ts">
    import type {PageData} from "./$types"

    export let data: PageData
</script>

{#each data.toplists as item}
     <a href="/toplists/{item.id}">
        <h2>{item.id} {item.name}</h2>
     </a>
{:else}
     <h1>No toplists</h1>
{/each}