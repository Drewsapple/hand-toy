<script lang="ts">
	import Hand from '$lib/components/hand.svelte';
	import Battery from '$lib/components/modules/Battery.svelte';
import CharCard from '$lib/components/modules/CharCard.svelte';
import Recorder from '$lib/components/modules/Recorder.svelte';
	import VibeMode from '$lib/components/modules/VibeMode.svelte';
import VibrationSettings from '$lib/components/VibrationSettings.svelte';
	import { bleData } from '$lib/stores/stores';
</script>

<div class="bg-orange-50 min-h-full">
	<h2 class="hero text-4xl p-4">My Prosthesis</h2>
	<div class="grid grid-cols-2">
		<div class="card card-bordered m-2 border-8 border-orange-200">
			<Battery percentage={85} />
		</div>
		<div class="card card-bordered m-2 border-8 border-orange-200">
			<VibeMode />
		</div>
		<div class="card card-bordered m-2 border-8 border-orange-200">
			<CharCard />
		</div>
		<div class="card card-bordered m-2 border-8 border-orange-200">
			<Recorder />
		</div>
		<div class="card card-bordered m-2 border-8 border-orange-200">
			<div class="card-body">
				<p class="card-title">+ Add Section</p>
			</div>
			<div class="card-actions" />
		</div>
	</div>
</div>

<style>
</style>
