<script lang="ts">
	import VibrationSettings from '$lib/components/VibrationSettings.svelte';
	import { afterUpdate } from 'svelte';
	import Scatterplot from '$lib/components/plots/scatterplot.svelte';
	import Lineplot from '$lib/components/plots/lineplot.svelte';
	let points: { timestamp: number; tip1: number; tip2: number }[] = [];

	let recording = false;

	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

	let recBuffer: { timestamp: number; tip1: number; tip2: number }[] = [];

	$: data = points.map((point) => {
		return {
			x: (point.timestamp - time) / 1000,
			y: point.tip1
		};
	});
    $: dataprime = points.map((point, index, arr) => {
		return {
			x: (point.timestamp - time) / 1000,
			y: index > 1 ? arr[index].tip1 - arr[index-1].tip1 : 0,
		};
	});
	$: data2 = points.map((point) => {
		return {
			x: (point.timestamp - time) / 1000,
			y: point.tip2
		};
	});
    $: data2prime = points.map((point, index, arr) => {
		return {
			x: (point.timestamp - time) / 1000,
			y: index > 1 ? arr[index].tip2 - arr[index-1].tip2 : 0,
		};
	});
</script>

<video id="video" muted={true} src="/trim.5AF0A6C8-6431-41A0-A3A5-F5DF17C5E849.MOV"></video>
{"ree"}
<Lineplot
	{...{
		data: data,
		minPoint: { x: -60, y: 0 },
		maxPoint: { x: 0, y: 2000 },
		xTickCount: 11,
		yTickCount: 6
	}}
/>
<Lineplot
	{...{
		data: dataprime,
		minPoint: { x: -60, y: -1000 },
		maxPoint: { x: 0, y: 1000 },
		xTickCount: 11,
		yTickCount: 5
	}}
/>

<Lineplot
	{...{
		data: data2,
		minPoint: { x: -60, y: 0 },
		maxPoint: { x: 0, y: 2000 },
		xTickCount: 11,
		yTickCount: 6
	}}
/>
<Lineplot
	{...{
		data: data2prime,
		minPoint: { x: -60, y: -1000 },
		maxPoint: { x: 0, y: 1000 },
		xTickCount: 11,
		yTickCount: 5
	}}
/>



<style>
	#video {
		width: 100vw;
		margin-left: 0;
	}
</style>
