<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	let { labels = [], values = [], title = '' }: { labels: string[]; values: number[]; title?: string } = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	const colors = ['#89b4fa', '#a6e3a1', '#fab387', '#f9e2af', '#cba6f7', '#f38ba8'];

	function createChart() {
		if (chart) chart.destroy();
		if (!canvas || !labels.length) return;
		chart = new Chart(canvas, {
			type: 'doughnut',
			data: {
				labels,
				datasets: [{
					data: values,
					backgroundColor: colors.slice(0, labels.length)
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: { color: '#cdd6f4' }
					}
				}
			}
		});
	}

	onMount(() => {
		createChart();
		return () => chart?.destroy();
	});

	$effect(() => {
		labels; values;
		tick().then(createChart);
	});
</script>

<div class="chart-container">
	{#if title}
		<h3 class="chart-title">{title}</h3>
	{/if}
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-container {
		background: #1e1e2e;
		border: 1px solid #313244;
		border-radius: 0.75rem;
		padding: 1rem;
		height: 280px;
	}
	.chart-title {
		font-size: 0.9rem;
		color: #cdd6f4;
		margin: 0 0 0.5rem;
	}
	canvas {
		width: 100% !important;
		height: calc(100% - 2rem) !important;
	}
</style>
