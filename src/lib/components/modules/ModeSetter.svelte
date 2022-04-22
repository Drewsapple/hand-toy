<script>
import { bleData } from "$lib/stores/stores";


	const modes = [
        ['Off', 'Position', 'Velocity', 'Velocity+Torque', 'Sweep'],
        ['Off', 'Calib', 'Run', 'Save', 'Load'],
        ['Off', 'Silent', 'High'],
        ['Off', 'Calib', 'Run', 'Save', 'Load'],
        ['Off', 'Debug']
    ];
    const modenames = ['Motor', 'Thumb Inputs', 'Haptics', 'Fingertips', 'Prints'];

	let selected = [];
    let synced = true;

    bleData.subscribe(async (data) => {
        if (data['Modes']) {
            if(synced) {
                selected = data['Modes'].value;
            }
        }
    });
	
</script>

<span class="">
	<span class="card">
		<p class="card-title">Modes</p>
        {#each modes as mode, i}
        <div class="card">
        <h3 class="text-center card-title bg-secondary">{modenames[i]}</h3>
		<ul class="steps card-body border border-secondary">
			{#each mode as label, j}
				<li class={'step ' + (selected[i] == j ? 'step-info' : '')} on:click={() => {
                    selected[i] = j;
                    synced = false;
                    }
                }>
					{label}
				</li>
			{/each}
		</ul>
        </div>
        {/each}
        <button class="btn" on:click={async () => {
            await $bleData['Modes'].characteristic.writeValue(new Uint8Array(selected));
            synced = true;
            console.log($bleData['Modes'])
        }}>Save</button>
	</span>
</span>

<style>
</style>
