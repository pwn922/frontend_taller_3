<script lang="ts">
	let { label, value, items }: { label: string; value: string | number; items?: string[] } = $props();
</script>

<div class="kpi-card">
	<div class="kpi-body">
		<span class="kpi-label">{label}</span>
		{#if items && items.length > 1}
			<ul class="kpi-list">
				{#each items as item}
					<li>{item}</li>
				{/each}
			</ul>
		{:else}
			<span class="kpi-value">{items?.[0] ?? value}</span>
		{/if}
	</div>
</div>

<style>
	.kpi-card {
		background: #1e1e2e;
		border: 1px solid #313244;
		border-radius: 0.75rem;
		padding: 1rem 1.25rem;
		min-width: 0;
	}
	.kpi-body {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.kpi-label {
		font-size: 0.75rem;
		color: #a6adc8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		word-break: break-word;
		overflow-wrap: break-word;
		line-height: 1.3;
		margin-bottom: 0.15rem;
	}
	.kpi-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #cdd6f4;
		word-break: break-word;
		overflow-wrap: break-word;
		line-height: 1.3;
	}
	.kpi-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.kpi-list li {
		font-size: 1.25rem;
		font-weight: 700;
		color: #cdd6f4;
		word-break: break-word;
		overflow-wrap: break-word;
		line-height: 1.3;
	}
	.kpi-list li::before {
		content: '•';
		color: #89b4fa;
		margin-right: 0.4rem;
	}
</style>
