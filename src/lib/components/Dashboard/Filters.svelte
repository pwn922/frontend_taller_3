<script lang="ts">
	import { onMount } from 'svelte';
	import type { Filters } from '$lib/types/dashboard';
	import * as api from '$lib/api/sales';

	let {
		filters,
		onFilterChange
	}: {
		filters: Filters;
		onFilterChange: (filters: Filters) => void;
	} = $props();

	let cities = $state<string[]>([]);
	let categories = $state<string[]>([]);
	let paymentMethods = $state<string[]>([]);

	onMount(async () => {
		[cities, categories, paymentMethods] = await Promise.all([
			api.getCities().catch((e) => {
				console.error('Failed to load cities:', e);
				return [];
			}),
			api.getCategories().catch((e) => {
				console.error('Failed to load categories:', e);
				return [];
			}),
			api.getPaymentMethods().catch((e) => {
				console.error('Failed to load payment methods:', e);
				return [];
			})
		]);
	});

	function update<K extends keyof Filters>(field: K, event: Event) {
		const target = event.target as HTMLInputElement | HTMLSelectElement;
		onFilterChange({ ...filters, [field]: target.value });
	}
</script>

<div class="filters">
	<div class="filter-group">
		<label for="filter-city">Ciudad</label>
		<select id="filter-city" value={filters.city} onchange={(e) => update('city', e)}>
			<option value="">Todas</option>
			{#each cities as city}
				<option value={city}>{city}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="filter-category">Categoría</label>
		<select id="filter-category" value={filters.category} onchange={(e) => update('category', e)}>
			<option value="">Todas</option>
			{#each categories as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="filter-payment">Método de pago</label>
		<select id="filter-payment" value={filters.payment_method} onchange={(e) => update('payment_method', e)}>
			<option value="">Todos</option>
			{#each paymentMethods as pm}
				<option value={pm}>{pm}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="filter-date-from">Fecha desde</label>
		<input id="filter-date-from" type="date" value={filters.date_from}
			onchange={(e) => update('date_from', e)} />
	</div>

	<div class="filter-group">
		<label for="filter-date-until">Fecha hasta</label>
		<input id="filter-date-until" type="date" value={filters.date_until}
			onchange={(e) => update('date_until', e)} />
	</div>
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		background: #1e1e2e;
		border: 1px solid #313244;
		border-radius: 0.75rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}
	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.filter-group label {
		font-size: 0.75rem;
		color: #a6adc8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.filter-group select,
	.filter-group input {
		background: #313244;
		color: #cdd6f4;
		border: 1px solid #45475a;
		border-radius: 0.5rem;
		padding: 0.4rem 0.6rem;
		font-size: 0.875rem;
	}
</style>
