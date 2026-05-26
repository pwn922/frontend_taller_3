<script lang="ts">
	import { onMount } from 'svelte';
	import KpiCard from '$lib/components/Dashboard/KpiCard.svelte';
	import Filters from '$lib/components/Dashboard/Filters.svelte';
	import ChartBar from '$lib/components/Dashboard/ChartBar.svelte';
	import ChartPie from '$lib/components/Dashboard/ChartPie.svelte';
	import ChartLine from '$lib/components/Dashboard/ChartLine.svelte';
	import ImportCsvButton from '$lib/components/Dashboard/ImportCsvButton.svelte';
	import * as api from '$lib/api/sales';
	import type { Filters as FiltersType, ChartData } from '$lib/types/dashboard';

	let loading = $state(true);
	let error = $state('');

	let filters = $state<FiltersType>({
		city: '',
		category: '',
		payment_method: '',
		date_from: '',
		date_until: ''
	});

	let refreshKey = $state(0);

	let totalVentas = $state(0);
	let promedioGasto = $state(0);
	let categoriaMasVendida = $state('-');
	let categoriaMasVendidaItems = $state<string[]>([]);
	let productoMasVendido = $state('-');
	let productoMasVendidoItems = $state<string[]>([]);
	let ciudadMasCompras = $state('-');
	let ciudadMasComprasItems = $state<string[]>([]);
	let metodoPagoMasUsado = $state('-');
	let metodoPagoMasUsadoItems = $state<string[]>([]);

	let ventasPorCategoria = $state<ChartData>({ labels: [], values: [] });
	let comprasPorCiudad = $state<ChartData>({ labels: [], values: [] });
	let comprasPorRangoEtario = $state<ChartData>({ labels: [], values: [] });
	let ventasPorFecha = $state<ChartData>({ labels: [], values: [] });
	let productosMasVendidos = $state<ChartData>({ labels: [], values: [] });
	let metodosPagoMasUsados = $state<ChartData>({ labels: [], values: [] });

	async function loadData() {
		loading = true;
		error = '';
		try {
			const [
				tv, pg, tc, pv, cc, mp,
				vpc, cpc, cre, vpf, pmv, mpmu
			] = await Promise.all([
				api.getTotalVentas(filters),
				api.getPromedioGasto(filters),
				api.getTopCategory(filters),
				api.getProductoMasVendido(filters),
				api.getCiudadMasComprada(filters),
				api.getMetodoPagoMasUsado(filters),

				/* Faltan */
				api.getVentasPorCategoria(filters).catch(() => ({ labels: [], values: [] })),
				api.getComprasPorCiudad(filters).catch(() => ({ labels: [], values: [] })),
				api.getComprasPorRangoEtario(filters).catch(() => ({ labels: [], values: [] })),
				api.getVentasPorFecha(filters).catch(() => ({ labels: [], values: [] })),
				api.getProductosMasVendidos(filters).catch(() => ({ labels: [], values: [] })),
				api.getMetodosPagoMasUsados(filters).catch(() => ({ labels: [], values: [] }))
			]);

			totalVentas = tv;
			promedioGasto = pg;
			categoriaMasVendidaItems = tc.split(', ').filter(Boolean);
			categoriaMasVendida = categoriaMasVendidaItems.join(', ');
			productoMasVendidoItems = pv.split(', ').filter(Boolean);
			productoMasVendido = productoMasVendidoItems.join(', ');
			ciudadMasComprasItems = cc.split(', ').filter(Boolean);
			ciudadMasCompras = ciudadMasComprasItems.join(', ');
			metodoPagoMasUsadoItems = mp.split(', ').filter(Boolean);
			metodoPagoMasUsado = metodoPagoMasUsadoItems.join(', ');

			ventasPorCategoria = vpc;
			comprasPorCiudad = cpc;
			comprasPorRangoEtario = cre;
			ventasPorFecha = vpf;
			productosMasVendidos = pmv;
			metodosPagoMasUsados = mpmu;
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	}

	function handleFilterChange(newFilters: FiltersType) {
		filters = newFilters;
		loadData();
	}

	function handleImportDone() {
		refreshKey++;
	}

	onMount(loadData);

	$effect(() => {
		refreshKey;
		loadData();
	});
</script>

<svelte:head>
	<title>Dashboard - Taller 3</title>
</svelte:head>

<div class="dashboard">
	<header class="dashboard-header">
		<div class="header-left">
			<div class="header-logo">A</div>
			<h1>Analítica de Compras</h1>
		</div>
		<ImportCsvButton onImportDone={handleImportDone} />
	</header>

	<Filters {filters} onFilterChange={handleFilterChange} />

	{#if loading}
		<div class="loading">Cargando datos...</div>
	{:else if error}
		<div class="error">Error: {error}</div>
	{:else}
		<section class="kpi-grid">
			<KpiCard label="Total Ventas" value={totalVentas?.toLocaleString() ?? 0} icon="💰" />
			<KpiCard label="Promedio Gasto" value={`$${promedioGasto?.toLocaleString() ?? 0}`} icon="📊" />
			<KpiCard label="Categoría(s) más vendida(s)" value={categoriaMasVendida} icon="🏷️" items={categoriaMasVendidaItems} />
			<KpiCard label="Producto(s) más vendido(s)" value={productoMasVendido} icon="⭐" items={productoMasVendidoItems} />
			<KpiCard label="Ciudad(es) con más compras" value={ciudadMasCompras} icon="📍" items={ciudadMasComprasItems} />
			<KpiCard label="Método(s) de pago más usado(s)" value={metodoPagoMasUsado} icon="💳" items={metodoPagoMasUsadoItems} />
		</section>

		<section class="charts-grid">
			<ChartBar title="Ventas por categoría" labels={ventasPorCategoria?.labels ?? []} values={ventasPorCategoria?.values ?? []} />
			<ChartBar title="Compras por ciudad" labels={comprasPorCiudad?.labels ?? []} values={comprasPorCiudad?.values ?? []} />
			<ChartBar title="Compras por rango etario" labels={comprasPorRangoEtario?.labels ?? []} values={comprasPorRangoEtario?.values ?? []} />
			<ChartLine title="Ventas por fecha" labels={ventasPorFecha?.labels ?? []} values={ventasPorFecha?.values ?? []} />
			<ChartBar title="Productos más vendidos" labels={productosMasVendidos?.labels ?? []} values={productosMasVendidos?.values ?? []} />
			<ChartPie title="Métodos de pago más usados" labels={metodosPagoMasUsados?.labels ?? []} values={metodosPagoMasUsados?.values ?? []} />
		</section>
	{/if}
</div>

<style>
	.dashboard {
		max-width: 1280px;
		margin: 0 auto;
		padding: 1.5rem;
	}
	.dashboard-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #313244;
		background: #181825;
		margin: -1.5rem -1.5rem 1.5rem;
		padding: 0.75rem 1.5rem;
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.header-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.5rem;
		background: #89b4fa;
		color: #1e1e2e;
		font-size: 0.875rem;
		font-weight: 700;
	}
	.dashboard-header h1 {
		font-size: 1.125rem;
		font-weight: 700;
		color: #cdd6f4;
		margin: 0;
	}
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
		align-items: start;
	}
	.charts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}
	.loading,
	.error {
		color: #a6adc8;
		font-size: 1.1rem;
		text-align: center;
		padding: 3rem 0;
	}
	.error {
		color: #f38ba8;
	}
</style>
