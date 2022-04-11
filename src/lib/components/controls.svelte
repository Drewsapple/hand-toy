<script lang="ts">
	import { bleData, bleConnection } from '$lib/stores/stores.js';

	let device;
	let server;
	let encoder = new TextEncoder();
	let connected = false;

	$: server = $bleConnection['server'];
	$: device = $bleConnection['device'];

	async function handleConnect() {
		if (server?.connected) {
			server.disconnect();
			connected = false;
			return;
		}
		device = await navigator.bluetooth.requestDevice({
			filters: [
				{
					name: 'Prosthesis'
				}
			],
			optionalServices: [
				'1a6a0dc9-7db0-4e5f-8b48-5122af7d0b73',
				'6e400003-b5a3-f393-e0a9-e50e24dcca9e',
				'6e400005-b5a3-f393-e0a9-e50e24dcca9e',
				'6e400007-b5a3-f393-e0a9-e50e24dcca9e',
				'6e400009-b5a3-f393-e0a9-e50e24dcca9e'
			]
		});
		$bleConnection['device'] = device;

		server = await device.gatt.connect();
		$bleConnection['server'] = server;
		connected = true;

		let services = await server.getPrimaryServices();
		let characteristics = await Promise.all(
			services.map(async (service) => await (await service.getCharacteristics())[0])
		);
		//console.log(await (characteristics[0]).readValue())
		await characteristics.forEach(async (char) => {
			await char;
			await console.log(char);
			// await console.log(char.uuid, new Float32Array(await char.value.buffer)[0])
			char.oncharacteristicvaluechanged = async () => {
				try {
					await char.readValue();
				} catch (err) {
					console.log(err);
				}
				let uuid = char.uuid;
				let value = new Float32Array(await char.value.buffer)[0];
				bleData.update((data) => {
					data[uuid] = {
						value,
						characteristic: char
					};
					return data;
				});
			};
			await char.readValue();
			//await char.startNotifications();
		});
		// 	return Promise.all([
		//         service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e").then(handleCharacteristicLogString),
		//         // service.getCharacteristic("6e400004-b5a3-f393-e0a9-e50e24dcca9e").then(handlePIDgains),
		// ]);
	}
</script>

<nav class="navbar bg-orange-200">
	<span class="navbar-start">
		<a class="p-2 btn rounded-md btn-ghost" href="/">Home</a>
		<a class="p-2 btn rounded-md btn-ghost" href="/handplot">Hand Plot</a>
		<a class="p-2 btn rounded-md btn-ghost" href="/feedback">Velo Test</a>
	</span>
	<span class="navbar-end">
		<button class="p-2 btn btn-ghost rounded-md" on:click={handleConnect}
			>{server?.connected ? 'Disconnect' : 'Connect Device'}</button
		>
	</span>
</nav>

<style>
</style>
