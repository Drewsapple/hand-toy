<script lang="ts">
	import { browser } from '$app/env';

    let angleCharacteristic = null;
    let angle: number = 0;
    let encoder = new TextEncoder();

	let servoService = null;
	function handleConnect() {
		navigator.bluetooth
			.requestDevice({
				filters: [{
                    services: ['829e76b6-1b78-4c97-aa0a-8c65e3815830']
                }]
			})
			.then((device) => device.gatt.connect())
			.then((server) => server.getPrimaryService('829e76b6-1b78-4c97-aa0a-8c65e3815830'))
			.then((service) => {
				servoService = service;
				return Promise.all([service.getCharacteristic("d2cc6bcc-fab2-44fc-848d-68e0fe5686ef").then(handleAngleCharacteristic)]);
			});
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

	function onServoAngleChanged(event) {
		const characteristic = event.target;
		console.log(characteristic.value);
	}

    function writeAngle(event){
        let num: number = event.target.value
        if(angleCharacteristic) {
            console.log(encoder.encode(angle.toString()))
            angleCharacteristic.writeValue(encoder.encode(angle.toString()))
        }
    }
</script>

<button on:click={handleConnect}>Connect Device</button>
<br/>
<label>
    Servo Angle:  
	<input type=number bind:value={angle} on:input={writeAngle} min=0 max=180>
    <br/>
	<input type=range bind:value={angle} on:input={writeAngle} min=0 max=180>
</label>