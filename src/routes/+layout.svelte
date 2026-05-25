<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		background: #11111b;
		color: #cdd6f4;
		font-family: system-ui, -apple-system, sans-serif;
	}
	.app {
		min-height: 100vh;
	}
</style>
