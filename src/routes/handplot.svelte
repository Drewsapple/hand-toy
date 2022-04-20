<script lang="ts">
	import { afterUpdate } from 'svelte/internal';
	import Scatterplot from '$lib/components/plots/scatterplot.svelte';
	import { bleData } from '$lib/stores/stores';
	import Lineplot from '$lib/components/plots/lineplot.svelte';
	import Scatter3D from '$lib/components/plots/Scatter3D.svelte';
	import Hand from '$lib/components/hand.svelte';
	import BleCharTable from '$lib/components/BLECharTable.svelte';

	let points: { timestamp: number; maxP: number; thumb: number }[] = [];
	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

	bleData.subscribe((data) => {
		points = points.filter((point) => point.timestamp - time > -60000);
		let thumbPos = data['Test1'];
		let maxPower = data['MaxPower'];
		if (thumbPos && maxPower) {
			points.push({
				timestamp: time,
				maxP: maxPower['value'][0],
				thumb: thumbPos['value'][0],
			});
		}
	});

	$: data = {
		points: points.map((point) => {
			return {
				x: (point.timestamp - time) / 1000,
				y: point.maxP
			};
		})
	};

	let thumb_distal;
	$: if (points?.length > 0) thumb_distal = points[points.length - 1].thumb;
</script>

<div id="container">
	<div>
		<h1>Remote data demo</h1>
	</div>

	<Lineplot
		{data}
		minPoint={{ x: -60, y: 0 }}
		maxPoint={{ x: 0, y: 1 }}
		xTickCount={11}
		yTickCount={6}
	/>
</div>
<div class="min-h-12">
	<Hand {thumb_distal} />
</div>
<!-- <BleCharTable /> -->

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
