<script lang="ts">
	import { format, mode } from 'd3';

	import { bleData } from '$lib/stores/stores';
	let vibConf;
	let characteristic;
	$: if ($bleData)
		characteristic = $bleData['6e400008-b5a3-f393-e0a9-e50e24dcca9e']?.characteristic;

	$: if (characteristic) vibConf = new Uint8Array(characteristic.value.buffer);

	let toggleVal = (channel) => {
		return async () => {
			vibConf[channel] = vibConf[channel] == 0 ? 1 : 0;
			characteristic.writeValue(vibConf);
		};
	};

	let saveSequence = async () => {
        let modelist = selectedMode.slice(0,seqLen)
        modelist.push(0);
        console.log(modelist)
        let modearr = new Uint8Array(modelist);
        
		console.log(modearr);
	};

	let selectedMode = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
    ];

	let modes = [
		{ id: 1, text: 'Strong Click - 100%' },
		{ id: 2, text: 'Strong Click - 60%' },
		{ id: 3, text: 'Strong Click - 30%' },
		{ id: 4, text: 'Sharp Click - 100%' },
		{ id: 5, text: 'Sharp Click - 60%' },
		{ id: 6, text: 'Sharp Click - 30%' },
		{ id: 7, text: 'Soft Bump - 100%' },
		{ id: 8, text: 'Soft Bump - 60%' },
		{ id: 9, text: 'Soft Bump - 30%' },
		{ id: 10, text: 'Double Click - 100%' },
		{ id: 11, text: 'Double Click - 60%' },
		{ id: 12, text: 'Triple Click - 100%' },
		{ id: 13, text: 'Soft Fuzz - 60%' },
		{ id: 14, text: 'Strong Buzz - 100%' },
		{ id: 15, text: '750 ms Alert 100%' },
		{ id: 16, text: '1000 ms Alert 100%' },
		{ id: 17, text: 'Strong Click 1 - 100%' },
		{ id: 18, text: 'Strong Click 2 - 80%' },
		{ id: 19, text: 'Strong Click 3 - 60%' },
		{ id: 20, text: 'Strong Click 4 - 30%' },
		{ id: 21, text: 'Medium Click 1 - 100%' },
		{ id: 22, text: 'Medium Click 2 - 80%' },
		{ id: 23, text: 'Medium Click 3 - 60%' },
		{ id: 24, text: 'Sharp Tick 1 - 100%' },
		{ id: 25, text: 'Sharp Tick 2 - 80%' },
		{ id: 26, text: 'Sharp Tick 3 – 60%' },
		{ id: 27, text: 'Short Double Click Strong 1 – 100%' },
		{ id: 28, text: 'Short Double Click Strong 2 – 80%' },
		{ id: 29, text: 'Short Double Click Strong 3 – 60%' },
		{ id: 30, text: 'Short Double Click Strong 4 – 30%' },
		{ id: 31, text: 'Short Double Click Medium 1 – 100%' },
		{ id: 32, text: 'Short Double Click Medium 2 – 80%' },
		{ id: 33, text: 'Short Double Click Medium 3 – 60%' },
		{ id: 34, text: 'Short Double Sharp Tick 1 – 100%' },
		{ id: 35, text: 'Short Double Sharp Tick 2 – 80%' },
		{ id: 36, text: 'Short Double Sharp Tick 3 – 60%' },
		{ id: 37, text: 'Long Double Sharp Click Strong 1 – 100%' },
		{ id: 38, text: 'Long Double Sharp Click Strong 2 – 80%' },
		{ id: 39, text: 'Long Double Sharp Click Strong 3 – 60%' },
		{ id: 40, text: 'Long Double Sharp Click Strong 4 – 30%' },
		{ id: 41, text: 'Long Double Sharp Click Medium 1 – 100%' },
		{ id: 42, text: 'Long Double Sharp Click Medium 2 – 80%' },
		{ id: 43, text: 'Long Double Sharp Click Medium 3 – 60%' },
		{ id: 44, text: 'Long Double Sharp Tick 1 – 100%' },
		{ id: 45, text: 'Long Double Sharp Tick 2 – 80%' },
		{ id: 46, text: 'Long Double Sharp Tick 3 – 60%' },
		{ id: 47, text: 'Buzz 1 – 100%' },
		{ id: 48, text: 'Buzz 2 – 80%' },
		{ id: 49, text: 'Buzz 3 – 60%' },
		{ id: 50, text: 'Buzz 4 – 40%' },
		{ id: 51, text: 'Buzz 5 – 20%' },
		{ id: 52, text: 'Pulsing Strong 1 – 100%' },
		{ id: 53, text: 'Pulsing Strong 2 – 60%' },
		{ id: 54, text: 'Pulsing Medium 1 – 100%' },
		{ id: 55, text: 'Pulsing Medium 2 – 60%' },
		{ id: 56, text: 'Pulsing Sharp 1 – 100%' },
		{ id: 57, text: 'Pulsing Sharp 2 – 60%' },
		{ id: 58, text: 'Transition Click 1 – 100%' },
		{ id: 59, text: 'Transition Click 2 – 80%' },
		{ id: 60, text: 'Transition Click 3 – 60%' },
		{ id: 61, text: 'Transition Click 4 – 40%' },
		{ id: 62, text: 'Transition Click 5 – 20%' },
		{ id: 63, text: 'Transition Click 6 – 10%' },
		{ id: 64, text: 'Transition Hum 1 – 100%' },
		{ id: 65, text: 'Transition Hum 2 – 80%' },
		{ id: 66, text: 'Transition Hum 3 – 60%' },
		{ id: 67, text: 'Transition Hum 4 – 40%' },
		{ id: 68, text: 'Transition Hum 5 – 20%' },
		{ id: 69, text: 'Transition Hum 6 – 10%' },
		{ id: 70, text: 'Transition Ramp Down Long Smooth 1 – 100 to 0%' },
		{ id: 71, text: 'Transition Ramp Down Long Smooth 2 – 100 to 0%' },
		{ id: 72, text: 'Transition Ramp Down Medium Smooth 1 – 100 to 0%' },
		{ id: 73, text: 'Transition Ramp Down Medium Smooth 2 – 100 to 0%' },
		{ id: 74, text: 'Transition Ramp Down Short Smooth 1 – 100 to 0%' },
		{ id: 75, text: 'Transition Ramp Down Short Smooth 2 – 100 to 0%' },
		{ id: 76, text: 'Transition Ramp Down Long Sharp 1 – 100 to 0%' },
		{ id: 77, text: 'Transition Ramp Down Long Sharp 2 – 100 to 0%' },
		{ id: 78, text: 'Transition Ramp Down Medium Sharp 1 – 100 to 0%' },
		{ id: 79, text: 'Transition Ramp Down Medium Sharp 2 – 100 to 0%' },
		{ id: 80, text: 'Transition Ramp Down Short Sharp 1 – 100 to 0%' },
		{ id: 81, text: 'Transition Ramp Down Short Sharp 2 – 100 to 0%' },
		{ id: 82, text: 'Transition Ramp Up Long Smooth 1 – 0 to 100%' },
		{ id: 83, text: 'Transition Ramp Up Long Smooth 2 – 0 to 100%' },
		{ id: 84, text: 'Transition Ramp Up Medium Smooth 1 – 0 to 100%' },
		{ id: 85, text: 'Transition Ramp Up Medium Smooth 2 – 0 to 100%' },
		{ id: 86, text: 'Transition Ramp Up Short Smooth 1 – 0 to 100%' },
		{ id: 87, text: 'Transition Ramp Up Short Smooth 2 – 0 to 100%' },
		{ id: 88, text: 'Transition Ramp Up Long Sharp 1 – 0 to 100%' },
		{ id: 89, text: 'Transition Ramp Up Long Sharp 2 – 0 to 100%' },
		{ id: 90, text: 'Transition Ramp Up Medium Sharp 1 – 0 to 100%' },
		{ id: 91, text: 'Transition Ramp Up Medium Sharp 2 – 0 to 100%' },
		{ id: 92, text: 'Transition Ramp Up Short Sharp 1 – 0 to 100%' },
		{ id: 93, text: 'Transition Ramp Up Short Sharp 2 – 0 to 100%' },
		{ id: 94, text: 'Transition Ramp Down Long Smooth 1 – 50 to 0%' },
		{ id: 95, text: 'Transition Ramp Down Long Smooth 2 – 50 to 0%' },
		{ id: 96, text: 'Transition Ramp Down Medium Smooth 1 – 50 to 0%' },
		{ id: 97, text: 'Transition Ramp Down Medium Smooth 2 – 50 to 0%' },
		{ id: 98, text: 'Transition Ramp Down Short Smooth 1 – 50 to 0%' },
		{ id: 99, text: 'Transition Ramp Down Short Smooth 2 – 50 to 0%' },
		{ id: 100, text: 'Transition Ramp Down Long Sharp 1 – 50 to 0%' },
		{ id: 101, text: 'Transition Ramp Down Long Sharp 2 – 50 to 0%' },
		{ id: 102, text: 'Transition Ramp Down Medium Sharp 1 – 50 to 0%' },
		{ id: 103, text: 'Transition Ramp Down Medium Sharp 2 – 50 to 0%' },
		{ id: 104, text: 'Transition Ramp Down Short Sharp 1 – 50 to 0%' },
		{ id: 105, text: 'Transition Ramp Down Short Sharp 2 – 50 to 0%' },
		{ id: 106, text: 'Transition Ramp Up Long Smooth 1 – 0 to 50%' },
		{ id: 107, text: 'Transition Ramp Up Long Smooth 2 – 0 to 50%' },
		{ id: 108, text: 'Transition Ramp Up Medium Smooth 1 – 0 to 50%' },
		{ id: 109, text: 'Transition Ramp Up Medium Smooth 2 – 0 to 50%' },
		{ id: 110, text: 'Transition Ramp Up Short Smooth 1 – 0 to 50%' },
		{ id: 111, text: 'Transition Ramp Up Short Smooth 2 – 0 to 50%' },
		{ id: 112, text: 'Transition Ramp Up Long Sharp 1 – 0 to 50%' },
		{ id: 113, text: 'Transition Ramp Up Long Sharp 2 – 0 to 50%' },
		{ id: 114, text: 'Transition Ramp Up Medium Sharp 1 – 0 to 50%' },
		{ id: 115, text: 'Transition Ramp Up Medium Sharp 2 – 0 to 50%' },
		{ id: 116, text: 'Transition Ramp Up Short Sharp 1 – 0 to 50%' },
		{ id: 117, text: 'Transition Ramp Up Short Sharp 2 – 0 to 50%' },
		{ id: 118, text: 'Long buzz for programmatic stopping – 100%' },
		{ id: 119, text: 'Smooth Hum 1 (No kick or brake pulse) – 50%' },
		{ id: 120, text: 'Smooth Hum 2 (No kick or brake pulse) – 40%' },
		{ id: 121, text: 'Smooth Hum 3 (No kick or brake pulse) – 30%' },
		{ id: 122, text: 'Smooth Hum 4 (No kick or brake pulse) – 20%' },
		{ id: 123, text: 'Smooth Hum 5 (No kick or brake pulse) – 10%' }
	];

	let seqLen = 1;
</script>

{#if vibConf}
	<span>
		<label>
        Pattern Length    
        <input bind:value={seqLen} type="range" min="1" max="7" />
        </label>
	</span>

	{#each Array.from({ length: seqLen }, (_, i) => i) as num}
		<br />
		{num + 1}
		<select bind:value={selectedMode[num]}>
			{#each modes as mode}
				<option value={mode.id}>{mode.text}</option>
			{/each}
		</select>
	{/each}
	<br />
	<button on:click={saveSequence}>Save and Test</button>
{/if}

<style>
</style>
