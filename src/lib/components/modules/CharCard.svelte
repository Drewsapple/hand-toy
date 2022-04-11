<script>
	import { bleData } from '$lib/stores/stores';
	import { afterUpdate } from 'svelte';
	import Lineplot from '../plots/lineplot.svelte';

	let selected;
	let pts = [];
	let time = Date.now();
	afterUpdate(() => {
		time = Date.now();
	});

    $: pts = pts.filter((point) => point.timestamp - time > -60000);

    bleData.subscribe((data) => {
        if(data[selected]) {
            pts.push({
				timestamp: time,
				value: data[selected].value
			});
        }
    })
</script>

<div class="card">
	<div class="card-body">
		<p class="card-title">60s Plot</p>
		{#if pts.length > 0}
			<Lineplot
				data={pts.map((point) => ({
                    x: point.timestamp - time,
                    y: point.value
                }))}
				minPoint={{ x: -60, y: -1 }}
				maxPoint={{ x: 0, y: 4096 }}
				xTickCount={11}
				yTickCount={7}
			/>
		{/if}
	</div>
	<div class="card-actions">
		<select
			bind:value={selected}
            class="select-lg"
			on:change={() => {
				pts = [];
			}}
		>
			{#each Object.entries($bleData) as characteristic}
				<option value={characteristic[0]}>{characteristic[0]}</option>
			{/each}
		</select>
	</div>
</div>
