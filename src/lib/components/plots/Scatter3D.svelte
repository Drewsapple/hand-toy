<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/env';
import { prevent_default } from 'svelte/internal';

    let THREE, OrbitControls;
    let container, width, height;
    let camera, scene, renderer, clock, controls;

    let positions: Float32Array;
    let scales: Float32Array;
    let particles;

    export let points: {points: {
        x: number,
        y: number,
        z: number,
    }[]} = {points: []}

    $: positions = new Float32Array(points.points.map( (curr) => [curr.x, curr.y, curr.z]).flat())

    $: scales = new Float32Array(points.points.map(() => .4));

    $: {
		if(camera && renderer){
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		}
	}

    function init() {
		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
		camera.position.set(3, 2, -2);
		camera.lookAt(0, 3, 0);
		camera.aspect = width/height;
		camera.updateProjectionMatrix();

		scene = new THREE.Scene();

		clock = new THREE.Clock();
        
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );
        
        const material = new THREE.ShaderMaterial( {
            
            uniforms: {
                color: { value: new THREE.Color( 0xffffff ) },
            },
            vertexShader: `
                attribute float scale;

                void main() {

                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                    gl_PointSize = scale * ( 300.0 / - mvPosition.z );

                    gl_Position = projectionMatrix * mvPosition;

                }
            `,
            fragmentShader: `

                uniform vec3 color;

                void main() {

                    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

                    gl_FragColor = vec4( color, 1.0 );

                }
            `,
            
        } );
        
        //
        
        particles = new THREE.Points( geometry, material );
        scene.add( particles );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        // Controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableZoom = true;
    }

    function render() {
        particles.geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        particles.geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;

        renderer.render( scene, camera );
    }

    function animate() {
        requestAnimationFrame(animate);

        render();
    }

    if (browser) {
		onMount(async () => {
			// Threejs stuff can ONLY happen in the browser, not prerender
			THREE = await import('three');
                // Stats = (await import('three/examples/jsm/libs/stats.module.js')).default;
                // GUI = (await import('three/examples/jsm/libs/dat.gui.module.js')).GUI;
                // GLTFLoader = (await import('three/examples/jsm/loaders/GLTFLoader.js')).GLTFLoader;
			OrbitControls = (await import('three/examples/jsm/controls/OrbitControls.js')).OrbitControls;

			init();
			animate();
		});

		onDestroy(async () => {
			// gui.destroy();
		})
	}
</script>


<div id="container" bind:clientWidth={width} bind:clientHeight={height} bind:this={container} />
<style>
	#container {
		flex: 1 1 auto;
		min-height: 5rem;
		min-width: 5rem;
		padding: 0;
		margin: 0;
	}
</style>