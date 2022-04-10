<script>
	import { bleData } from '../stores/stores';
    let entry = {};
    $: console.log(entry)
</script>

<table>
	<tr>
		<td>UUID/Name</td>
		<td>Live Value</td>
		<td>Send Value</td>
	</tr>
	{#each Object.entries($bleData) as characteristic}
		<tr>
			<td>{characteristic[0]}</td>
			<td>{characteristic[1].value}</td>
            <td><input type="number" on:input={(e) => {entry[characteristic[0]] = e.target.value }} /></td>
			<!-- svelte-ignore missing-declaration -->
			<td
				><button
					on:click={() => {
                        if(entry[characteristic[0]]) {
                            let payload = new Float32Array([entry[characteristic[0]]]);
                            characteristic[1].characteristic.writeValue(payload);
                        }
					}}>Send</button
				></td
			>
		</tr>
	{/each}
</table>

<style>
</style>
