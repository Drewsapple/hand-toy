<script lang="ts">
	import BleCharTable from '$lib/components/BLECharTable.svelte';
	import ModeSetter from '$lib/components/modules/ModeSetter.svelte';
	import { bleData } from '$lib/stores/stores.js';


</script>

<div id="container">
	<BleCharTable />
	<ModeSetter />
</div>

<style>
</style>
