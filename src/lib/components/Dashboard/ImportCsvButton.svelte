<script lang="ts">
	import { importCsv, type ImportResult } from '$lib/api/sales';

	let { onImportDone }: { onImportDone?: () => void } = $props();

	let inputEl: HTMLInputElement;
	let uploading = $state(false);
	let result = $state<ImportResult | null>(null);
	let error = $state<string | null>(null);
	let deleteExisting = $state(false);

	async function handleFile(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		uploading = true;
		result = null;
		error = null;

		try {
			const data = await importCsv(file, deleteExisting);
			result = data;
			onImportDone?.();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al importar';
		} finally {
			uploading = false;
			if (inputEl) inputEl.value = '';
		}
	}
</script>

<div class="import-csv-wrapper">
	<input
		bind:this={inputEl}
		type="file"
		accept=".csv"
		onchange={handleFile}
		class="hidden-input"
	/>

	<button
		onclick={() => inputEl?.click()}
		disabled={uploading}
		class="import-btn"
	>
		{#if uploading}
			<svg class="spin-icon" viewBox="0 0 24 24" fill="none">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
			</svg>
			Importando...
		{:else}
			<svg class="btn-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
			</svg>
			Importar CSV
		{/if}
	</button>

	<label class="checkbox-label">
		<input
			type="checkbox"
			bind:checked={deleteExisting}
			class="checkbox"
		/>
		Reemplazar datos existentes
	</label>

	{#if result || error}
		<div class="popup">
			{#if error}
				<div class="popup-error">
					<svg class="popup-icon error-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
					</svg>
					<p class="popup-text error-text">{error}</p>
				</div>
			{/if}
			{#if result}
				<div class="popup-success">
					<svg class="popup-icon success-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
					<div>
						<p class="popup-title">Importación exitosa</p>
						<p class="popup-detail">
							{result.imported} registros importados
							{result.errors > 0 ? ` · ${result.errors} errores` : ''}
							{result.total_lines > 0 ? ` · ${result.total_lines} líneas` : ''}
						</p>
					</div>
				</div>
			{/if}
			<button
				onclick={() => { result = null; error = null }}
				class="close-btn"
			>
				Cerrar
			</button>
		</div>
	{/if}
</div>

<style>
	.import-csv-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
	}

	.hidden-input {
		display: none;
	}

	.import-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #89b4fa;
		color: #1e1e2e;
		border: none;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	.import-btn:hover:not(:disabled) {
		background: #74c7ec;
	}

	.import-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-icon {
		width: 1rem;
		height: 1rem;
	}

	.spin-icon {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: #a6adc8;
		cursor: pointer;
	}

	.checkbox {
		width: 0.875rem;
		height: 0.875rem;
		accent-color: #89b4fa;
	}

	.popup {
		position: absolute;
		right: 0;
		top: 100%;
		z-index: 50;
		margin-top: 0.5rem;
		width: 20rem;
		background: #1e1e2e;
		border: 1px solid #45475a;
		border-radius: 0.75rem;
		padding: 1rem;
		box-shadow: 0 8px 24px rgba(0,0,0,0.4);
	}

	.popup-error {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.popup-success {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.popup-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.error-icon { color: #f38ba8; }
	.success-icon { color: #a6e3a1; }

	.popup-text {
		font-size: 0.875rem;
		color: #f38ba8;
		margin: 0;
	}

	.popup-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #a6e3a1;
		margin: 0 0 0.15rem;
	}

	.popup-detail {
		font-size: 0.75rem;
		color: #a6adc8;
		margin: 0;
	}

	.close-btn {
		width: 100%;
		margin-top: 0.75rem;
		background: #313244;
		color: #cdd6f4;
		border: none;
		border-radius: 0.5rem;
		padding: 0.4rem;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.close-btn:hover {
		background: #45475a;
	}

	.error-text { color: #f38ba8; }
</style>
