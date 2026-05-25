<script lang="ts">
	import type { Filters } from '$lib/types/dashboard';

	let {
		filters,
		onFilterChange
	}: {
		filters: Filters;
		onFilterChange: (filters: Filters) => void;
	} = $props();

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
			<option value="Santiago">Santiago</option>
			<option value="Valparaiso">Valparaíso</option>
			<option value="Concepcion">Concepción</option>
			<option value="La Serena">La Serena</option>
			<option value="Antofagasta">Antofagasta</option>
		</select>
	</div>

	<div class="filter-group">
		<label for="filter-category">Categoría</label>
		<select id="filter-category" value={filters.category} onchange={(e) => update('category', e)}>
			<option value="">Todas</option>
			<option value="Electronica">Electrónica</option>
			<option value="Juguetes">Juguetes</option>
			<option value="Comida">Comida</option>
			<option value="Ropa">Ropa</option>
			<option value="Hogar">Hogar</option>
		</select>
	</div>

	<div class="filter-group">
		<label for="filter-payment">Método de pago</label>
		<select id="filter-payment" value={filters.payment_method} onchange={(e) => update('payment_method', e)}>
			<option value="">Todos</option>
			<option value="Tarjeta de credito">Tarjeta de crédito</option>
			<option value="Tarjeta de debito">Tarjeta de débito</option>
			<option value="Efectivo">Efectivo</option>
			<option value="Transferencia">Transferencia</option>
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
