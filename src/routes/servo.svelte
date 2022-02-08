<script lang="ts">
	import { afterUpdate, dataset_dev, each, loop_guard } from 'svelte/internal';
	import Scatterplot from '../components/plots/scatterplot.svelte';
	import ServoControl from '../components/servoControl.svelte';
	import { bleData } from '../stores/stores.js';
	import Lineplot from '../components/plots/lineplot.svelte';
	import Scatter3D from '../components/plots/Scatter3D.svelte';
	import Hand from '../components/hand.svelte';

	let points: { timestamp: number; period: number; sin: number }[] = [];
	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

	bleData.subscribe((data) => {
		points = points.filter((point) => point.timestamp - time > -60000);
		let sinData = data['6e400002-b5a3-f393-e0a9-e50e24dcca9e'];
		let periodData = data['6e400006-b5a3-f393-e0a9-e50e24dcca9e'];
		if (sinData && periodData) {
			points.push({
				timestamp: time,
				period: periodData['value'],
				sin: sinData['value']
			});
		}
	});

	$: data = {
		points: points.map((point) => {
			return {
				x: (point.timestamp - time) / 1000,
				y: point.sin
			};
		})
	};

	$: data3 = {
		points: points.map((point) => {
			return {
				x: (point.timestamp - time) / 1000,
				y: point.period,
				z: 5 * point.sin
			};
		})
	};

	let thumb_distal;
	$: if (points?.length > 0) thumb_distal = points[points.length-1].sin
</script>

<div id="container">
	<div>
		<h1>Remote data demo</h1>
	</div>

	<ServoControl />
	<Lineplot
		{data}
		minPoint={{ x: -60, y: -1 }}
		maxPoint={{ x: 0, y: 1 }}
		xTickCount={11}
		yTickCount={7}
	/>
</div>
<Hand {thumb_distal} />


<!-- <div id="plot3d" >
    <Scatter3D points={data3} />
</div> -->

<table>
	{#each Object.entries($bleData) as characteristic (characteristic[0])}
		<tr>
			<td>{characteristic[0]}</td>
			<td>{$bleData[characteristic[0]].value}</td>
			<!-- svelte-ignore missing-declaration -->
			<td
				><button
					on:click={() => {
						let payload = new Float32Array([$bleData[characteristic[0]].value * 2]);
						$bleData[characteristic[0]].characteristic.writeValue(payload);
					}}>increment</button
				></td
			>
		</tr>
	{/each}
</table>

<style>
	#container {
		max-width: 100vw;
		height: 50vh;
		display: flex;
		flex-direction: column;
	}
	#container > * {
		padding: 1rem;
	}
	/* #plot3d {
		height: 50vh;
		display: flex;
	} */
	:global(body) {
		margin: 0;
	}
</style>
