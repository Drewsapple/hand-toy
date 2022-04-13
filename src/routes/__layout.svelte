<script lang=ts>
import Controls from "$lib/components/controls.svelte";
import "../app.css"
     
</script>
<div class="min-h-screen bg-neutral max-w-screen overflow-y-hidden">
    <Controls />
    <slot></slot>
</div>
<style>

</style>