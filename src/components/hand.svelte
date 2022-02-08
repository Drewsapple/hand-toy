<script lang="ts">
	import { onDestroy } from 'svelte';
	import { spring } from 'svelte/motion';
	import {
		SkeletonHelper
	} from 'three';
	import {
		Canvas,
		DirectionalLight,
		HemisphereLight,
		OrbitControls,
		PerspectiveCamera,
		GLTF,
	} from 'threlte';

	export let thumb_distal = 0;

	let handle;
	let hand;
	let skele;
	onDestroy(() => {
		if (handle) cancelAnimationFrame(handle);
	});

	const bounce = spring(1);
	$: $bounce = thumb_distal;	
	$: if(hand) {
		skele = new SkeletonHelper(hand?.children[2])
	}

	$: if(skele) { skele.bones.find((bone) => bone.name == 'thumb03L').rotation.x = $bounce }

</script>

<div>
	<Canvas>
		<PerspectiveCamera position={{ x: -.3, y: .3, z: -.5 }}>
			<OrbitControls enableDamping />
		</PerspectiveCamera>

		<DirectionalLight shadow color={'#EDBD9C'} position={{ x: 15, y: 45, z: -20 }} />

		<HemisphereLight skyColor={0x4c8eac} groundColor={0xac844c} intensity={0.6} />

		<GLTF castShadow receiveShadow bind:scene={hand} url={'/lefthand_tex.glb'} position={{ y: -0.15 }} scale={3} />
	</Canvas>
</div>

<style>
	div {
		position: flex;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
