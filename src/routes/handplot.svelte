<script lang="ts">
	import { afterUpdate } from 'svelte/internal';
	import Scatterplot from '$lib/components/plots/scatterplot.svelte';
	import { bleData } from '$lib/stores/stores';
	import Lineplot from '$lib/components/plots/lineplot.svelte';
	import Scatter3D from '$lib/components/plots/Scatter3D.svelte';
	import Hand from '$lib/components/hand.svelte';
	import BleCharTable from '$lib/components/BLECharTable.svelte';

	let points: { timestamp: number; period: number; sin: number; tip: number }[] = [];
	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

	bleData.subscribe((data) => {
		points = points.filter((point) => point.timestamp - time > -60000);
		let thumbPos = data['6e400002-b5a3-f393-e0a9-e50e24dcca9e'] / 4096;
		let test3 = data['6e400006-b5a3-f393-e0a9-e50e24dcca9e'];
		let tipData = data['6e400004-b5a3-f393-e0a9-e50e24dcca9e'];
		if (thumbPos && test3 && tipData) {
			points.push({
				timestamp: time,
				period: test3['value'],
				sin: thumbPos['value'],
				tip: tipData['value'] / 1200
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
	$: if (points?.length > 0) thumb_distal = points[points.length - 1].sin;
</script>

<div id="container">
	<div>
		<h1>Remote data demo</h1>
	</div>

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
<BleCharTable />

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
