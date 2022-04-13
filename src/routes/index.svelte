<script lang="ts">
	import Hand from '$lib/components/hand.svelte';
	import Battery from '$lib/components/modules/Battery.svelte';
import CharCard from '$lib/components/modules/CharCard.svelte';
import Recorder from '$lib/components/modules/Recorder.svelte';
import ThumbControl from '$lib/components/modules/ThumbControl.svelte';
	import VibeMode from '$lib/components/modules/VibeMode.svelte';
import VibrationSettings from '$lib/components/VibrationSettings.svelte';
	import { bleData } from '$lib/stores/stores';
</script>

<div class="min-h-full">
	<div class="grid grid-cols-1 md:grid-cols-2">
		<div class="card card-bordered m-2 border-8 border-secondary">
			<Battery percentage={85} />
		</div>
		<div class="card card-bordered m-2 border-8 border-secondary">
			<VibeMode />
		</div>
		<div class="card card-bordered m-2 border-8 border-secondary">
			<CharCard />
		</div>
		<div class="card card-bordered m-2 border-8 border-secondary">
			<Recorder />
		</div>
		<div class="card card-bordered m-2 border-8 border-secondary">
			<ThumbControl />
		</div>
		<div class="card card-bordered m-2 border-8 border-secondary">
			<div class="card-body">
				<p class="card-title">+ Add Section</p>
			</div>
			<div class="card-actions" />
		</div>
	</div>
</div>

<style>
</style>
