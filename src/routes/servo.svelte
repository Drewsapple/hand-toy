<script lang='ts'>
    import Scatterplot from "../components/plots/scatterplot.svelte";
    import ServoControl from "../components/servoControl.svelte";
</script>
<div id="container">
    <div>
        <h1>Servo Tester</h1>
        <p>This demo uses WebBluetooth to send angles to a servo</p>
    </div>

    <ServoControl/>
    <Scatterplot data={{points: [
        {x: 10, y: 10},
        {x: 20, y: 60},
        {x: 40, y: 10},
    ]}}
    minPoint={{x: 0, y: 0}}
    maxPoint={{x: 60, y: 100}}
    xTickCount={16}
    yTickCount={11}
    ></Scatterplot>
</div>

<style>
    #container {
        max-width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    #container > * {
        padding: 1rem;
    }
    :global(body) {
        margin: 0;
    }
</style>