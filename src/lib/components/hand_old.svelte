<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/env';
	
	let Stats, THREE, GUI, GLTFLoader, OrbitControls;

	let container, stats, clock, width, height;
	let camera, scene, renderer, controls, gui;
	let hands: typeof THREE.Mesh, skele: typeof THREE.SkeletonHelper;

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

		// loading manager

		const loadingManager = new THREE.LoadingManager(function () {
			scene.add(hands);

			// Setup gui options for controlling the hand
			gui = new GUI();
			const thumb = gui.addFolder('Thumb');
			thumb.add(
				skele.bones.find((bone) => bone.name == 'thumb01L').rotation, 
				'x', 
				-Math.PI*2/5, -Math.PI/10
			);
			thumb.__controllers[0].name('Metacarpal X');
			thumb.add(
				skele.bones.find((bone) => bone.name == 'thumb01L').rotation, 
				'y', 
				Math.PI/10, Math.PI/3
			);
			thumb.__controllers[1].name('Metacarpal Y');
			thumb.add(
				skele.bones.find((bone) => bone.name == 'thumb02L').rotation, 
				'x', 
				0, Math.PI/3
			);
			thumb.__controllers[2].name('Proximal');
			thumb.add(
				skele.bones.find((bone) => bone.name == 'thumb03L').rotation, 
				'x', 
				-Math.PI/5, Math.PI/3
			);
			thumb.__controllers[3].name('Distal');

			const pointer = gui.addFolder('Pointer');
			pointer.add(
				skele.bones.find((bone) => bone.name == 'finger_index01L').rotation,
				'x', 
				-Math.PI/10, Math.PI/2
			);
			pointer.__controllers[0].name('Proximal');
			pointer.add(
				skele.bones.find((bone) => bone.name == 'finger_index02L').rotation,
				'x',
				-Math.PI/30, Math.PI*5/8
			);
			pointer.__controllers[1].name('Middle');
			pointer.add(
				skele.bones.find((bone) => bone.name == 'finger_index03L').rotation,
				'x',
				-Math.PI/10, Math.PI/3
			);
			pointer.__controllers[2].name('Distal');
		});

		// gltf

		const loader = new GLTFLoader(loadingManager);
		loader.load('/lefthand_tex.glb', function (gltf) {
			hands = gltf.scene;
			hands.rotation.y += -Math.PI/2;
			hands.scale.x = hands.scale.y = hands.scale.z = 10;
			hands.position.z += -.1;
			skele = new THREE.SkeletonHelper(hands);
		});
		//

		const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(1, 1, 0).normalize();
		scene.add(directionalLight);

		//scene.add(new THREE.AxesHelper())

		//

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		//

		stats = new Stats();
		stats.domElement.style.position = "absolute";
		container.appendChild(stats.domElement);

		// Controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableZoom = false;
	}

	function animate() {
		requestAnimationFrame(animate);

		renderScene();
		stats.update();
	}

	function renderScene() {
		const delta = clock.getDelta();

		if (hands !== undefined) {

		}
		if (skele !== undefined) {
		}

		renderer.render(scene, camera);
	}

	if (browser) {
		onMount(async () => {
			// Threejs stuff can ONLY happen in the browser, not prerender
			THREE = await import('three');
			Stats = (await import('three/examples/jsm/libs/stats.module.js')).default;
			GUI = (await import('three/examples/jsm/libs/dat.gui.module.js')).GUI;
			GLTFLoader = (await import('three/examples/jsm/loaders/GLTFLoader.js')).GLTFLoader;
			OrbitControls = (await import('three/examples/jsm/controls/OrbitControls.js')).OrbitControls;

			init();
			animate();
		});

		onDestroy(async () => {
			gui.destroy();
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