<script lang="ts">
	import { browser } from '$app/env';
    import { writable } from 'svelte/store';
    import {bleData} from '../stores/stores.js'

    let angleCharacteristic = null;
    let angle: number = 0;
    let encoder = new TextEncoder();

    

    let server;
	async function handleConnect() {
		let device = await (navigator.bluetooth
			.requestDevice({
				filters: [
                    {
                        name: "Prosthesis",
                    },
                ],
                optionalServices: [
                    '1a6a0dc9-7db0-4e5f-8b48-5122af7d0b73',
                    '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
                    '6e400005-b5a3-f393-e0a9-e50e24dcca9e',
                ]
			})
        )

		let server = await device.gatt.connect()
        let services = await server.getPrimaryServices()
        let characteristics = await Promise.all(services.map(async service => await (await service.getCharacteristics())[0] ) );
        //console.log(await (characteristics[0]).readValue())
        await characteristics.forEach(async char => {
            await char;
            await console.log(char)
            // await console.log(char.uuid, new Float32Array(await char.value.buffer)[0])
            char.oncharacteristicvaluechanged = async () => {
                await char.readValue()
                let uuid = char.uuid; 
                let value = new Float32Array(await char.value.buffer)[0];
                bleData.update(data => {
                    data[uuid] = {
                        value,
                        characteristic: char,
                    }
                    return data
                })
                
            }
            await char.readValue()
            //await char.startNotifications();
        });
        // 	return Promise.all([
        //         service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e").then(handleCharacteristicLogString),
        //         // service.getCharacteristic("6e400004-b5a3-f393-e0a9-e50e24dcca9e").then(handlePIDgains),
        // ]);
	}

	function handleAngleCharacteristic(characteristic) {
        angleCharacteristic = characteristic;
        setInterval(async () => {
            let angleData: DataView = await characteristic.readValue()
            let newAngle: number = 0
            for(let i = 0; i < angleData.byteLength; i++){
                let digit = angleData.getUint8(i) - 0x30;
                newAngle += digit * (10 ** (angleData.byteLength - i - 1))
            }
            angle = newAngle
        }, 50)
	}

    function handleEncoderCharacteristic(characteristic) {
        setInterval(async () => {
            console.log(await characteristic.readValue())
        }, 50)
    }

    function handlePIDgains(characteristic) {
        setInterval(async () => {
            console.log((await characteristic.readValue()) )
        }, 5000)
    }

    function handleCharacteristicLogString(characteristic) {
        console.log(characteristic)
        characteristic.oncharacteristicvaluechanged(() => {
            console.log(characteristic.value)
        })
    }

	function onServoAngleChanged(event) {
		const characteristic = event.target;
		console.log(characteristic.value);
	}

    function writeAngle(event){
        let num: number = event.target.value
        if(angleCharacteristic) {
            // console.log(encoder.encode(angle.toString()))
            angleCharacteristic.writeValue(encoder.encode(angle.toString()))
        }
    }
</script>

<button on:click={handleConnect}>Connect Device</button>
<br />

<label>
	Servo Angle:
	<input type="number" bind:value={angle} on:input={writeAngle} min="0" max="180" />
	<br />
	<input type="range" bind:value={angle} on:input={writeAngle} min="0" max="180" />
</label>
