<script lang="ts">
	import { onMount } from 'svelte';
	import { line, scaleLinear } from 'd3';

	interface Data2D {
		points: point[];
	}
	interface point {
		x: number;
		y: number;
	}
	export let data: Data2D;
	export let minPoint: point;
	export let maxPoint: point;
	export let xTickCount: number;
	export let yTickCount: number;
    export let precision: number = 2;

	let svg: SVGElement;
	$: width = 100;
	$: height = 100;

	let xTicks = linspace(minPoint.x, maxPoint.x, xTickCount);
	let yTicks = linspace(minPoint.y, maxPoint.y, yTickCount);

	const padding = { top: 50, right: 50, bottom: 50, left: 50 };
	$: xScale = scaleLinear()
		.domain([minPoint.x, maxPoint.x])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([minPoint.y, maxPoint.y])
		.range([height - padding.bottom, padding.top]);
	onMount(resize);
	function resize() {
		({ width, height } = svg.getBoundingClientRect());
		// xTicks = linspace(minPoint.x, maxPoint.x, xTickCount);
		// yTicks = linspace(minPoint.y, maxPoint.y, yTickCount);
	}

	function linspace(start: number, stop: number, steps: number): number[] {
		var arr = [];
		var step = (stop - start) / (steps - 1);
		for (var i = 0; i < steps; i++) {
			arr.push(start + step * i);
		}
		return arr;
	}

	$: lineFromData = () => {
		return line()
			.x((d) => xScale(d.x))
			.y((d) => yScale(d.y))(data.points);
	}
</script>

<svelte:window on:resize={resize} />

<svg bind:this={svg}>
	<g class="axis y-axis">
		{#each yTicks as tick}
			<g class="tick tick-{tick.toPrecision(precision)}" transform="translate(0, {yScale(tick)})">
				<line x1={padding.left} x2={xScale(maxPoint.x)} />
				<text x={padding.left - 8} y="+4">{tick}</text>
			</g>
		{/each}
	</g>

	<g class="axis x-axis">
		{#each xTicks as tick}
			<g class="tick" transform="translate({xScale(tick)},0)">
				<line y1={yScale(minPoint.y)} y2={yScale(maxPoint.y)} />
				<text y={height - padding.bottom + 16}>{tick.toPrecision(precision)}</text>
			</g>
		{/each}
	</g>

	<path d={lineFromData()} />
</svg>

<style>
	svg {
		height: 100%;
		width: 100%;
	}
	.tick line {
		stroke: #222;
		stroke-dasharray: 2;
	}
	.timeline line {
		stroke: #F11;
	}
	text {
		font-size: 12px;
		fill: #999;
	}
	path {
		stroke: #000;
		fill: transparent;
		stroke-width: 1px;
	}
	.x-axis text {
		text-anchor: middle;
        writing-mode: vertical-rl;
	}
	.y-axis text {
		text-anchor: end;
	}
</style>
