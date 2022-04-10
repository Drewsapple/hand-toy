<script lang="ts">
	import { bleData } from '../stores/stores';
	import VibrationSettings from '../components/VibrationSettings.svelte';
	import { afterUpdate } from 'svelte';
	import Scatterplot from '../components/plots/scatterplot.svelte';
	import { map } from 'd3';
	import Lineplot from '../components/plots/lineplot.svelte';
	let points: { timestamp: number; tip1: number; tip2: number }[] = [];

	let recording = false;

	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

	bleData.subscribe((data) => {
		points = points.filter((point) => point.timestamp - time > -60000);
		let tip1 = data['6e400004-b5a3-f393-e0a9-e50e24dcca9e'];
		let tip2 = data['6e40000a-b5a3-f393-e0a9-e50e24dcca9e'];
		if (tip1 && tip2) {
			points.push({
				timestamp: time,
				tip1: tip1['value'],
				tip2: tip2['value']
			});
			if (recording) {
				console.log('recording');
				recBuffer.push({
					timestamp: time,
					tip1: tip1['value'],
					tip2: tip2['value']
				});
			}
		}
	});

	let recBuffer: { timestamp: number; tip1: number; tip2: number }[] = [];

	function downloadObjectAsJson(exportObj, exportName) {
		var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', exportName + '.json');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

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

<br /><br /><br /><br /><br /><br />
<VibrationSettings />

<button
	on:click={() => {
		recording = !recording;
	}}
>
	{recording ? 'Stop Recording' : 'Start Recording'}
</button>

<button
	on:click={() => {
		recording = false;
		downloadObjectAsJson(recBuffer, time);
		recBuffer = [];
	}}>Dump Recording</button
>

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
</style>
