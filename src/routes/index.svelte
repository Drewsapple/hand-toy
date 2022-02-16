<script lang='ts'>
import Hand from "../components/hand.svelte";
import { bleData } from "../stores/stores"
    
</script>
<div id="container">
    <div>
        <h1>Welcome to Hand-Toy</h1>
        <p>This demo is built using Svelte-Kit and Three.js</p>
    </div>

</div>


<table>
	{#each Object.entries($bleData) as characteristic}
		<tr>
			<td>{characteristic[0]}</td>
			<td>{characteristic[1].value}</td>
			<!-- svelte-ignore missing-declaration -->
			<td
				><button
					on:click={() => {
						let payload = new Float32Array([characteristic[1].value * 2]);
						characteristic[1].characteristic.writeValue(payload);
					}}>increment</button
				></td
			>
		</tr>
	{/each}
</table>


<style>
    #container {
        max-width: 100vw;
        max-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    #container > * {
        padding: 1rem;
    }
</style>