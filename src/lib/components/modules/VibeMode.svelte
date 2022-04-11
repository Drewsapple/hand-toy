<script>
export let modes = ["Off", "Silent", "High"];
let selected = 1;
</script>

<span class="">
    <span class="card-body">
        <p class="card-title">Vibration Mode</p>
        <ul class="steps">
            {#each modes as mode,i}
            <li class={"step " + (selected==i ? "step-info" : "")} on:click={() => selected = i}>{mode}</li>
            {/each}
          </ul>
    </span>
</span>

<style>

</style>