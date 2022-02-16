<script lang=ts>
    import {bleData} from "../stores/stores";
    let vibConf;
    let characteristic;
    $: if($bleData) characteristic = $bleData["6e400008-b5a3-f393-e0a9-e50e24dcca9e"]?.characteristic

    $: if(characteristic) vibConf = new Uint8Array(characteristic.value.buffer)

    let toggleVal3 = async () => {
        vibConf[2] = vibConf[2] == 0 ? 1 : 0;
        characteristic.writeValue(vibConf);
    }
</script>

{#if vibConf}
{vibConf}
<button on:click={toggleVal3} >Toggle 3</button>
{/if}

<style>

</style>