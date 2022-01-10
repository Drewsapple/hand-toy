<script lang='ts'>
    import { onMount, tick } from "svelte";
import { afterUpdate, dataset_dev, each, loop_guard } from "svelte/internal";
    import Scatterplot from "../components/plots/scatterplot.svelte";
    import LinePlot from "../components/plots/lineplot.svelte";
    import ServoControl from "../components/servoControl.svelte";
    import { bleData } from "../stores/stores.js";
import Lineplot from "../components/plots/lineplot.svelte";
    
    let points: {timestamp: number, value: number}[] = []
    let time = Date.now();
    afterUpdate(() => {
        time = Date.now()
    })
    
    bleData.subscribe(data => {
        points = points.filter((point) => (point.timestamp - time) > -60000);
        let listing = data['6e400002-b5a3-f393-e0a9-e50e24dcca9e']
        if(listing){
            points.push({
                timestamp: time,
                value: listing['value'],
            })
        }
    })
    
    $: data = {
        points: points.map((point) => {
            return {
                x: (point.timestamp - time)/1000,
                y: point.value,
            }
        })
    }
</script>

<div id="container">
    <div>
        <h1>Servo Tester</h1>
        <p>This demo uses WebBluetooth to send angles to a servo</p>
    </div>
    
    <ServoControl />
    <Lineplot data={data}
    minPoint={{x: -60, y: -1}}
    maxPoint={{x: 0, y: 1}}
    xTickCount={16}
    yTickCount={11}
    ></Lineplot>
    <button on:click={() => console.log($bleData)} >log points</button>
</div>

<table>
	{#each Object.entries($bleData) as characteristic (characteristic[0])}
		<tr>
			<td>{characteristic[0]}</td>
			<td>{$bleData[characteristic[0]].value}</td>
            <td><button on:click={ () => {
                let payload = new Float32Array(
                    [
                        $bleData[characteristic[0]].value * 2
                    ]
                )
                $bleData[characteristic[0]].characteristic.writeValue(payload)
            } }>increment</button></td>
		</tr>
	{/each}
</table>

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