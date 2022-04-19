<script>
	import { bleData } from '$lib/stores/stores';
	let angle = 0;
	let updatable = true;

	let key = 'MaxPower';

	bleData.subscribe((data) => {
		if (updatable && data[key]) {
			angle = data[key].value;
		}
	});
</script>

<div class="card-body">
	<p class="card-title">Thumb Power Limit</p>
	<input
		type="range"
		class="range"
		min={0}
		max={1}
		step={0.01}
		bind:value={angle}
		on:input={async (e) => {
			updatable = false;
			let char = $bleData[key].characteristic;
			let payload = new Float32Array([angle]);
			console.log(char);
			console.log(payload);
			await char.writeValue(payload);
			updatable = true;
		}}
	/>
</div>
<div class="card-actions" />

<style>
</style>
