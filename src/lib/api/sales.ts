import type { Filters, ChartData } from '$lib/types/dashboard';

const BASE_URL = 'http://127.0.0.1:8000/api/sales';

interface ApiEnvelope<T> {
	success: boolean;
	message: string;
	data: T;
}

function buildParams(filters: Filters, allowedFields: (keyof Filters)[]): URLSearchParams {
	const params = new URLSearchParams();
	for (const field of allowedFields) {
		const val = filters[field];
		if (val) params.append(field, val);
	}
	return params;
}

async function fetchJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
	const json: ApiEnvelope<T> = await res.json();
	if (!json.success) throw new Error(json.message || 'Error desconocido');
	return json.data;
}

export async function getTotalVentas(filters: Filters): Promise<number> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ total_ventas: number }>(`${BASE_URL}/total-ventas?${params}`);
	return data.total_ventas;
}

export async function getPromedioGasto(filters: Filters): Promise<number> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ promedio_gasto: number }>(`${BASE_URL}/promedio-gasto?${params}`);
	return data.promedio_gasto;
}

export async function getTopCategory(filters: Filters): Promise<string> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ categories: { category: string; total: number }[] }>(`${BASE_URL}/top-category?${params}`);
	return data.categories?.map(c => c.category).join(', ') ?? '-';
}

export async function getProductoMasVendido(filters: Filters): Promise<string> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ products: { product: string; total: number }[] }>(`${BASE_URL}/producto-mas-vendido?${params}`);
	return data.products?.map(p => p.product).join(', ') ?? '-';
}

export async function getCiudadMasComprada(filters: Filters): Promise<string> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ cities: { city: string; total: number }[] }>(`${BASE_URL}/ciudad-mas-comprada?${params}`);
	return data.cities?.map(c => c.city).join(', ') ?? '-';
}

export async function getMetodoPagoMasUsado(filters: Filters): Promise<string> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ payment_methods: { payment_method: string; total: number }[] }>(`${BASE_URL}/metodo-pago-mas-usado?${params}`);
	return data.payment_methods?.map(m => m.payment_method).join(', ') ?? '-';
}

export async function getVentasPorCategoria(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ categories: { category: string; total: number }[] }>(`${BASE_URL}/ventas-por-categoria?${params}`);
	return {
		labels: data.categories?.map(c => c.category) ?? [],
		values: data.categories?.map(c => c.total) ?? []
	};
}

// TODO: endpoint no implementado en backend
export async function getComprasPorCiudad(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ cities: { city: string; total: number }[] }>(`${BASE_URL}/compras-por-ciudad?${params}`);
	return {
		labels: data.cities?.map(c => c.city) ?? [],
		values: data.cities?.map(c => c.total) ?? []
	};
}

export async function getComprasPorRangoEtario(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ age_ranges: { range: string; total: number }[] }>(`${BASE_URL}/compras-por-rango-etario?${params}`);
	return {
		labels: data.age_ranges?.map(a => a.range) ?? [],
		values: data.age_ranges?.map(a => a.total) ?? []
	};
}

// TODO: endpoint no implementado en backend
export async function getVentasPorFecha(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ daily_sales: { date: string; total: number }[] }>(`${BASE_URL}/ventas-por-fecha?${params}`);
	return {
		labels: data.daily_sales?.map(d => d.date) ?? [],
		values: data.daily_sales?.map(d => d.total) ?? []
	};
}

export async function getProductosMasVendidos(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ products: { product: string; total: number }[] }>(`${BASE_URL}/productos-mas-vendidos?${params}`);
	return {
		labels: data.products?.map(p => p.product) ?? [],
		values: data.products?.map(p => p.total) ?? []
	};
}

// TODO: endpoint no implementado en backend
export async function getMetodosPago(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'date_from', 'date_until']);
	// const data = await fetchJson<{ payment_methods: { payment_method: string; total: number }[] }>(`${BASE_URL}/metodos-pago?${params}`);
	// return {
	// 	labels: data.payment_methods?.map(m => m.payment_method) ?? [],
	// 	values: data.payment_methods?.map(m => m.total) ?? []
	// };
	return { labels: [], values: [] };
}

export async function getCategories(): Promise<string[]> {
	const data = await fetchJson<{ categories: string[] }>(`${BASE_URL}/categorias`);
	return data.categories ?? [];
}

export async function getCities(): Promise<string[]> {
	const data = await fetchJson<{ cities: string[] }>(`${BASE_URL}/ciudades`);
	return data.cities ?? [];
}

export async function getPaymentMethods(): Promise<string[]> {
	const data = await fetchJson<{ payment_methods: string[] }>(`${BASE_URL}/metodos-pago`);
	return data.payment_methods ?? [];
}

export interface ImportResult {
	imported: number;
	errors: number;
	total_lines: number;
}

export async function importCsv(file: File, deleteExisting: boolean): Promise<ImportResult> {
  const formData = new FormData();
  formData.set('file', file);
  formData.set('delete_existing', String(deleteExisting));

  const res = await fetch(`${BASE_URL}/import-csv`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  const json: ApiEnvelope<ImportResult> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;

}

export async function getMetodosPagoMasUsados(filters: Filters): Promise<ChartData> {
	const params = buildParams(filters, ['city', 'category', 'payment_method', 'date_from', 'date_until']);
	const data = await fetchJson<{ payment_methods: { payment_method: string; total: number }[] }>(`${BASE_URL}/metodos-pago-mas-usados?${params}`);
	return {
		labels: data.payment_methods?.map(m => m.payment_method) ?? [],
		values: data.payment_methods?.map(m => m.total) ?? []
	};
}
