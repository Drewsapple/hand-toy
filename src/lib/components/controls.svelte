<script lang="ts">
	import { bleData, bleConnection } from '$lib/stores/stores.js';

	let device;
	let server;
	let connected = false;
	let watchdog;

	let friendlyNames = {
		"6e400002-b5a3-f393-e0a9-e50e24dcca9e" : "Test1",
		"6e400006-b5a3-f393-e0a9-e50e24dcca9e" : "MaxPower",
		"6e400008-b5a3-f393-e0a9-e50e24dcca9e" : "VibConf",
		"6e400004-b5a3-f393-e0a9-e50e24dcca9e" : "Force Readings",
		"6e40000a-b5a3-f393-e0a9-e50e24dcca9e" : "Velo2",
		"6e40000d-b5a3-f393-e0a9-e50e24dcca9e" : "Modes",
	};

	$: server = $bleConnection['server'];
	$: device = $bleConnection['device'];

	async function handleConnect() {
		console.debug("handleConnect:");
		if(watchdog) clearInterval(watchdog);
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
				'6e400009-b5a3-f393-e0a9-e50e24dcca9e',
				'6e40000b-b5a3-f393-e0a9-e50e24dcca9e'
			]
		});
		$bleConnection['device'] = device;

		server = await device.gatt.connect();
		watchdog = setInterval(() => {
			connected = server.connected
		}, 1000);
		$bleConnection['server'] = server;
		

		let services = await server.getPrimaryServices();
		let characteristics = await Promise.all(
			services.map(async (service) => await (await service.getCharacteristics())[0])
		);
		//console.log(await (characteristics[0]).readValue())
		await characteristics.forEach(async (char) => {
			await char;
			console.log(char);
			char.oncharacteristicvaluechanged = async (e) => {
				let value;
				let buffer = char.value.buffer;
				if(buffer.byteLength %4 != 0) {
					// console.log(`${friendlyNames[char.uuid]} length suggests uint8, length ${buffer.byteLength}`);
					value = new Uint8Array(buffer);
				}
				else{
					// console.log(`${friendlyNames[char.uuid]} length suggests float32`);
					value = new Float32Array(buffer);
				}
				bleData.update((data) => {
					data[friendlyNames[char.uuid]] = {
						value,
						characteristic: char
					};
					return data;
				});
			};
			setInterval(async () => {
				if(connected) {
					try{
						await char.readValue();
					}
					catch(e) {
						console.debug(e.message)
					}
				}
			}, 500)
			// await char.startNotifications();
		});
	}
</script>

<nav class="navbar bg-secondary max-w-screen overflow-hidden">
	<span class="navbar-start">
		<a class="p-2 btn rounded-md btn-ghost" href="/">Home</a>
		<a class="p-2 btn rounded-md btn-ghost" href="/handplot">Hand Plot</a>
		<a class="p-2 btn rounded-md btn-ghost" href="/feedback">Velo Test</a>
		<a class="p-2 btn rounded-md btn-ghost" href="/proptable">Prop Table</a>
	</span>
	<span class="navbar-center invisible md:visible" >
		<p class="text-2xl">My Prosthesis</p>
	</span>
	<span class="navbar-end">
		<button class="p-2 btn btn-ghost rounded-md" on:click={handleConnect}
			>{connected ? 'Disconnect' : 'Connect Device'}</button
		>
	</span>
</nav>

<style>
</style>
