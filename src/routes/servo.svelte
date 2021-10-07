<script lang='ts'>
    import ServoControl from "../components/servoControl.svelte";
        
    </script>
    <div id="container">
        <div>
            <h1>Servo Tester</h1>
            <p>This demo uses WebBluetooth to send angles to a servo</p>
        </div>
    
        <ServoControl/>
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