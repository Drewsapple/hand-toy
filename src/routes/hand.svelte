<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	
	let Stats, THREE, GUI, GLTFLoader, OrbitControls;

	let container, stats, clock, width, height;
	let camera, scene, renderer, controls, hands, skele;

	$: {
		if(camera && renderer){
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		}
	}

	function init() {
		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
		camera.position.set(8, 10, 8);
		camera.lookAt(0, 3, 0);
		camera.aspect = width/height;
		camera.updateProjectionMatrix();

		scene = new THREE.Scene();

		clock = new THREE.Clock();

		// loading manager

		const loadingManager = new THREE.LoadingManager(function () {
			scene.add(hands);
			scene.add(skele);
			scene.add(new THREE.AxesHelper(5));

			const gui = new GUI();
			const thumbDistal = gui.addFolder('Thumb Distal');
			thumbDistal.add(skele.bones[19].rotation, 'x', -Math.PI, Math.PI);
			thumbDistal.__controllers[0].name('rotation.x');
			thumbDistal.add(skele.bones[19].rotation, 'y', -Math.PI, Math.PI);
			thumbDistal.__controllers[1].name('rotation.y');
			thumbDistal.add(skele.bones[19].rotation, 'z', -Math.PI, Math.PI);
			thumbDistal.__controllers[2].name('rotation.z');

			const thumbProximal = gui.addFolder('Thumb Proximal');
			thumbProximal.add(skele.bones[18].rotation, 'x', -Math.PI, Math.PI);
			thumbProximal.__controllers[0].name('rotation.x');
			thumbProximal.add(skele.bones[18].rotation, 'y', -Math.PI, Math.PI);
			thumbProximal.__controllers[1].name('rotation.y');
			thumbProximal.add(skele.bones[18].rotation, 'z', -Math.PI, Math.PI);
			thumbProximal.__controllers[2].name('rotation.z');

			const thumbMetacarpal = gui.addFolder('Thumb Metacarpal');
			thumbMetacarpal.add(skele.bones[17].rotation, 'x', -Math.PI, Math.PI);
			thumbMetacarpal.__controllers[0].name('rotation.x');
			thumbMetacarpal.add(skele.bones[17].rotation, 'y', -Math.PI, Math.PI);
			thumbMetacarpal.__controllers[1].name('rotation.y');
			thumbMetacarpal.add(skele.bones[17].rotation, 'z', -Math.PI, Math.PI);
			thumbMetacarpal.__controllers[2].name('rotation.z');

			const pointerDistal = gui.addFolder('Pointer Distal');
			pointerDistal.add(
				skele.bones.find((bone) => bone.name == 'finger_index03L').rotation,
				'x',
				-Math.PI,
				Math.PI
			);
			pointerDistal.__controllers[0].name('rotation.x');
			pointerDistal.add(
				skele.bones.find((bone) => bone.name == 'finger_index03L').rotation,
				'y',
				-Math.PI,
				Math.PI
			);
			pointerDistal.__controllers[1].name('rotation.y');
			pointerDistal.add(
				skele.bones.find((bone) => bone.name == 'finger_index03L').rotation,
				'z',
				-Math.PI,
				Math.PI
			);
			pointerDistal.__controllers[2].name('rotation.z');

			const pointerMiddle = gui.addFolder('Pointer Middle');
			pointerMiddle.add(
				skele.bones.find((bone) => bone.name == 'finger_index02L').rotation,
				'x',
				-Math.PI,
				Math.PI
			);
			pointerMiddle.__controllers[0].name('rotation.x');
			pointerMiddle.add(
				skele.bones.find((bone) => bone.name == 'finger_index02L').rotation,
				'y',
				-Math.PI,
				Math.PI
			);
			pointerMiddle.__controllers[1].name('rotation.y');
			pointerMiddle.add(
				skele.bones.find((bone) => bone.name == 'finger_index02L').rotation,
				'z',
				-Math.PI,
				Math.PI
			);
			pointerMiddle.__controllers[2].name('rotation.z');

			const pointerProximal = gui.addFolder('Pointer Proximal');
			pointerProximal.add(
				skele.bones.find((bone) => bone.name == 'finger_index01L').rotation,
				'x',
				-Math.PI,
				Math.PI
			);
			pointerProximal.__controllers[0].name('rotation.x');
			pointerProximal.add(
				skele.bones.find((bone) => bone.name == 'finger_index01L').rotation,
				'y',
				-Math.PI,
				Math.PI
			);
			pointerProximal.__controllers[1].name('rotation.y');
			pointerProximal.add(
				skele.bones.find((bone) => bone.name == 'finger_index01L').rotation,
				'z',
				-Math.PI,
				Math.PI
			);
			pointerProximal.__controllers[2].name('rotation.z');
		});

		// gltf

		const loader = new GLTFLoader(loadingManager);
		loader.load('/lefthand_tex.glb', function (gltf) {
			hands = gltf.scene;
			hands.scale.x = hands.scale.y = hands.scale.z = 10;
			hands.rotation.y = 180;
			skele = new THREE.SkeletonHelper(hands);
		});

		//

		const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(1, 1, 0).normalize();
		scene.add(directionalLight);

		//

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		//

		stats = new Stats();
		container.appendChild(stats.dom);

		// Controls
		controls = new OrbitControls(camera, renderer.domElement);
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
	}
</script>

<div id="container" bind:clientWidth={width} bind:clientHeight={height} bind:this={container} />

<style>
	#container {
		height: 100vh;
	}
	:global(body) {
		/* this will apply to <body> */
		margin: 0;
	}
</style>