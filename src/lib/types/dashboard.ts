export interface Filters {
	city: string;
	category: string;
	payment_method: string;
	date_from: string;
	date_until: string;
}

export interface KpiData {
	total_ventas: number;
	promedio_gasto: number;
	categoria_mas_vendida: string;
	producto_mas_vendido: string;
	ciudad_mas_compras: string;
	metodo_pago_mas_usado: string;
}

export interface ChartData {
	labels: string[];
	values: number[];
}

export interface ApiResponse<T> {
	data: T;
	error?: string;
}
