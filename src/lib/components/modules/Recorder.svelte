<script>
	import { bleData } from '$lib/stores/stores';
	import { afterUpdate } from 'svelte';
	import Lineplot from '../plots/lineplot.svelte';

	let selected = [];
	let points = [];
	let recording = false;
	let file = '';

	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

	bleData.subscribe((data) => {
		if (recording) {
			let row = '';
			row += `${time},`;
			for (var charname of selected) {
				row += `${data[charname].value},`;
			}
			file += row + '\n';
		}
	});
</script>

<div class="card">
	<div class="card-body">
		<p class="card-title">Record Datastreams</p>
		<p>{selected.length} selected</p>
		{#if recording}
			<button
				class="btn"
				on:click={() => {
					recording = false;
				}}>Stop</button
			>
		{:else}
			<button
				class="btn"
				on:click={() => {
					recording = true;
					file = "timestamp, ";
					for (var charname of selected) {
						file += charname+', ';
					};
					file += '\n';
				}}>Record</button
			>
			{#if file != ""}
				<a class='btn' href={window.URL.createObjectURL(new Blob([file], { type: 'text/csv' }))} download={`recording_${time}.csv`}>Download</a>
			{/if}
		{/if}
	</div>
	<div class="card-actions">
		<select
			multiple
			bind:value={selected}
			
		>
			{#each Object.entries($bleData) as characteristic}
				<option value={characteristic[0]}>{characteristic[0]}</option>
			{/each}
		</select>
	</div>
</div>
