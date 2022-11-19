<script lang="ts">
let searchedMovie = ""

const handleChange =async () => {
    console.log(searchedMovie)
}
</script>


<h1>Movies</h1>
<input placeholder="Search movie" type="text" bind:value={searchedMovie} on:input={handleChange}>



<style>

</style>