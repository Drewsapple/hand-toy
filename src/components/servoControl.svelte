<script lang="ts">
	import { bleData, bleConnection } from '../stores/stores.js';

	let device;
	let server;
	let encoder = new TextEncoder();

	$: server = $bleConnection['server'];
	$: device = $bleConnection['device'];

	async function handleConnect() {
		if (server?.connected) {
			server.disconnect();
			console.log('disconnected');
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
				'6e400005-b5a3-f393-e0a9-e50e24dcca9e'
			]
		});
		$bleConnection['device'] = device;

		server = await device.gatt.connect();
		$bleConnection['server'] = server;

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
                if(server?.connected == false) return;
				await char.readValue();
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

<nav class="headerbar">
	<a href="/">Home</a>
	<a href="/handplot">Hand Plot</a>
	<button id="connector" on:click={handleConnect}
		>{server?.connected ? 'Disconnect' : 'Connect Device'}</button
	>
</nav>

<style>
	.headerbar {
		position: fixed;
	}
	#connector {
		position: fixed;
		right: 0;
	}
</style>
