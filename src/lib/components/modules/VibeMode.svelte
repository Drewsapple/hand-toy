<script>
	import VibrationSettings from '../VibrationSettings.svelte';

	export let modes = ['Off', 'Silent', 'High'];
	let selected = 1;
	let push;
	let copyConf;
</script>

<span class="">
	<span class="card-body">
		<p class="card-title">Vibration Mode</p>
		<ul class="steps">
			{#each modes as mode, i}
				<li class={'step ' + (selected == i ? 'step-info' : '')} on:click={() => (selected = i)}>
					{mode}
				</li>
			{/each}
		</ul>
	</span>
	<label for="vib_modal" class="btn modal-button">Edit Modes</label>

	<input type="checkbox" id="vib_modal" class="modal-toggle" />
	<div class="modal">
		<div class="modal-box">
			<label for="vib_modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			<h3 class="font-bold text-lg">Reconfigure Vibrations</h3>
			<VibrationSettings mode={selected} bind:push bind:copyConf />
			<div class="modal-action">
				<label
					for="vib_modal"
					class="btn"
					on:click={async () => {
						if (push) {
							await push();
							copyConf();
						} else {
							console.log('no push function');
						}
					}}>Save</label
				>
			</div>
		</div>
	</div>
</span>

<style>
</style>
