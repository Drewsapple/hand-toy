<script lang='ts'>
import Hand from "../components/hand.svelte";
    
</script>
<div id="container">
    <div>
        <h1>Welcome to Hand-Toy</h1>
        <p>This demo is built using Svelte-Kit and Three.js</p>
    </div>

    <Hand/>
</div>
<style>
    #container {
        max-width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    #container > * {
        padding: 1rem;
    }
    :global(body) {
        margin: 0;
    }
</style>