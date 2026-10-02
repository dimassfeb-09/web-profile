<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';

	let { data }: PageProps = $props();
	const keys = $derived(data.keys);

	interface KeyRow {
		id: string;
		name: string;
		prefix: string;
		scope: 'read' | 'read_write';
		created_at: string;
		last_used_at: string | null;
		revoked_at: string | null;
		status: 'active' | 'revoked';
	}

	let isModalOpen = $state(false);
	let isLoading = $state(false);
	let formName = $state('');
	// ponytail: least privilege by default. This endpoint can delete content, so write access
	// should be something you opt into, not the default a stray agent inherits.
	let formScope = $state<'read' | 'read_write'>('read');
	let mintedKey = $state<{ key: string; name: string; scope: string } | null>(null);
	let copied = $state(false);
	let errorMessage = $state('');

	const formatDate = (iso: string | null) => {
		if (!iso) return '—';
		return new Date(iso).toLocaleString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const openCreate = () => {
		formName = '';
		formScope = 'read';
		errorMessage = '';
		isModalOpen = true;
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';
		try {
			const res = await fetch('/api/admin/mcp-keys', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: formName, scope: formScope })
			});
			const result = await res.json();
			if (!res.ok) {
				errorMessage = result.message ?? 'Failed to create key';
				return;
			}
			isModalOpen = false;
			mintedKey = { key: result.data.key, name: result.data.name, scope: result.data.scope };
			copied = false;
			await invalidateAll();
		} catch {
			errorMessage = 'Failed to create key';
		} finally {
			isLoading = false;
		}
	};

	const copyKey = async () => {
		if (!mintedKey) return;
		try {
			await navigator.clipboard.writeText(mintedKey.key);
			copied = true;
		} catch {
			copied = false;
			errorMessage = 'Could not copy — select the key and copy it manually.';
		}
	};

	const handleRevoke = async (prefix: string, name: string) => {
		if (!confirm(`Revoke "${name}" (${prefix})? Any client using it stops working immediately.`))
			return;
		isLoading = true;
		try {
			const res = await fetch('/api/admin/mcp-keys', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prefix })
			});
			const result = await res.json();
			if (!res.ok) {
				alert(result.message ?? 'Failed to revoke key');
				return;
			}
			await invalidateAll();
		} catch {
			alert('Failed to revoke key');
		} finally {
			isLoading = false;
		}
	};

	const activeCount = $derived(keys.filter((key: KeyRow) => key.status === 'active').length);
</script>

<div class="space-y-8">
	<AdminHeader
		title="MCP Keys"
		description="Manage API keys for the MCP endpoint. Keys are shown once — only the hash is stored."
		buttonLabel="Create Key"
		onButtonClick={openCreate}
	/>

	<!-- Endpoint hint — same card language as other admin pages -->
	<div class="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
					<span class="material-symbols-outlined text-primary text-xl">key</span>
				</div>
				<div>
					<p class="font-label text-sm font-medium text-on-surface">Endpoint</p>
					<p class="font-mono text-xs text-on-surface-variant">POST /mcp · Streamable HTTP</p>
				</div>
			</div>
			<span
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/10 font-label text-xs text-on-surface-variant w-fit"
			>
				<span class="w-2 h-2 rounded-full bg-green-500"></span>
				{activeCount} active
			</span>
		</div>
		<div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div class="rounded-xl bg-surface-container-high border border-outline-variant/10 px-4 py-3">
				<p class="font-label text-[10px] tracking-widest uppercase text-on-surface-variant">URL</p>
				<p class="font-mono text-xs text-on-surface mt-1 break-all">https://www.dimassfeb.com/mcp</p>
			</div>
			<div class="rounded-xl bg-surface-container-high border border-outline-variant/10 px-4 py-3">
				<p class="font-label text-[10px] tracking-widest uppercase text-on-surface-variant">Header</p>
				<p class="font-mono text-xs text-on-surface mt-1 break-all">Authorization: Bearer &lt;key&gt;</p>
			</div>
		</div>
	</div>

	<!-- Keys grid — matches Skill Categories / Projects card language -->
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
		{#each keys as key (key.id)}
			<div
				class={`bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 flex flex-col group h-full ${key.status === 'revoked' ? 'opacity-60' : ''}`}
			>
				<div class="flex items-start justify-between gap-3 mb-4">
					<div class="flex items-center gap-3 min-w-0">
						<div
							class={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${key.status === 'revoked' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary/10 text-primary'}`}
						>
							<span class="material-symbols-outlined text-xl">vpn_key</span>
						</div>
						<div class="min-w-0">
							<h3 class="font-headline text-base font-bold text-on-surface truncate">{key.name}</h3>
							<p class="font-mono text-[11px] text-on-surface-variant truncate">{key.prefix}</p>
						</div>
					</div>
					<span
						class={`shrink-0 px-2.5 py-1 rounded-full font-label text-[10px] font-bold tracking-wider uppercase border ${
							key.status === 'revoked'
								? 'bg-surface-container-high text-on-surface-variant border-outline-variant/20'
								: key.scope === 'read_write'
									? 'bg-error/10 text-error border-error/20'
									: 'bg-primary/10 text-primary border-primary/20'
						}`}
					>
						{key.status === 'revoked' ? 'revoked' : key.scope === 'read_write' ? 'read / write' : 'read only'}
					</span>
				</div>

				<dl class="space-y-2 text-xs mb-6 flex-grow">
					<div class="flex justify-between gap-4">
						<dt class="text-on-surface-variant">Created</dt>
						<dd class="text-on-surface font-medium">{formatDate(key.created_at)}</dd>
					</div>
					<div class="flex justify-between gap-4">
						<dt class="text-on-surface-variant">Last used</dt>
						<dd class={key.last_used_at ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
							{formatDate(key.last_used_at)}
						</dd>
					</div>
					{#if key.status === 'revoked'}
						<div class="flex justify-between gap-4">
							<dt class="text-on-surface-variant">Revoked</dt>
							<dd class="text-on-surface-variant">{formatDate(key.revoked_at)}</dd>
						</div>
					{/if}
				</dl>

				{#if key.status === 'active'}
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleRevoke(key.prefix, key.name)}
						class="w-full py-3 rounded-xl bg-surface-container-high text-error font-label text-sm font-medium hover:bg-error/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<span class="material-symbols-outlined text-base">block</span>
						Revoke
					</button>
				{:else}
					<p class="text-xs text-on-surface-variant text-center py-2">Kept for audit trail.</p>
				{/if}
			</div>
		{:else}
			<div
				class="col-span-full bg-surface-container-low border border-dashed border-outline-variant/20 rounded-3xl p-10 flex flex-col items-center text-center"
			>
				<div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center mb-3">
					<span class="material-symbols-outlined text-on-surface-variant">key_off</span>
				</div>
				<p class="font-label text-sm font-medium text-on-surface">No keys yet</p>
				<p class="font-body text-sm text-on-surface-variant mt-1 max-w-sm">
					Create one to let an agent authenticate against <span class="font-mono text-xs">/mcp</span>.
				</p>
			</div>
		{/each}
	</div>

	<!-- Create dialog — same form language as Skills/Projects -->
	<AdminModal isOpen={isModalOpen} onClose={() => (isModalOpen = false)} title="Create MCP Key">
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-2">
				<label for="key-name" class="font-label text-xs text-on-surface-variant ml-1">Name</label>
				<input
					id="key-name"
					type="text"
					required
					maxlength="60"
					placeholder="e.g. research-agent"
					value={formName}
					oninput={(e) => (formName = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
				<p class="text-xs text-on-surface-variant ml-1">Use the client or trust level as the name.</p>
			</div>

			<fieldset class="space-y-3">
				<legend class="font-label text-xs text-on-surface-variant ml-1">Scope</legend>
				{#each [{ value: 'read', label: 'Read only', hint: 'get_content only.' }, { value: 'read_write', label: 'Read and write', hint: 'Full CRUD, including delete.' }] as const as option (option.value)}
					<label
						class={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
							formScope === option.value
								? 'border-primary bg-primary/5'
								: 'border-outline-variant/20 bg-surface-container-high'
						}`}
					>
						<input
							type="radio"
							name="scope"
							value={option.value}
							checked={formScope === option.value}
							onchange={() => (formScope = option.value)}
							class="mt-0.5 accent-primary"
						/>
						<span>
							<span class="block text-sm font-medium text-on-surface">{option.label}</span>
							<span class="block text-xs text-on-surface-variant mt-0.5">{option.hint}</span>
						</span>
					</label>
				{/each}
			</fieldset>

			{#if errorMessage}
				<p class="text-sm text-error" role="alert">{errorMessage}</p>
			{/if}

			<button
				type="submit"
				disabled={isLoading}
				class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body disabled:opacity-50"
			>
				{isLoading ? 'Creating…' : 'Create Key'}
			</button>
		</form>
	</AdminModal>

	<!-- One-time reveal — same modal chrome, minimal content -->
	<AdminModal isOpen={mintedKey !== null} onClose={() => (mintedKey = null)} title="Save your key">
		<div class="space-y-6">
			<div class="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
				<span class="material-symbols-outlined text-amber-600 shrink-0">warning</span>
				<p class="text-sm text-on-surface leading-relaxed">
					Shown once. Only the hash is stored — it cannot be recovered. Copy it now or revoke and mint a new one.
				</p>
			</div>

			<div class="space-y-2">
				<p class="font-label text-xs text-on-surface-variant ml-1">
					{mintedKey?.name} · {mintedKey?.scope === 'read_write' ? 'read / write' : 'read only'}
				</p>
				<code
					class="block w-full p-4 rounded-xl bg-surface-container-high border border-outline-variant/20 font-mono text-xs text-on-surface break-all select-all"
				>
					{mintedKey?.key}
				</code>
			</div>

			{#if errorMessage}
				<p class="text-sm text-error" role="alert">{errorMessage}</p>
			{/if}

			<div class="flex flex-col sm:flex-row gap-3">
				<button
					type="button"
					onclick={copyKey}
					class="flex-1 py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body flex items-center justify-center gap-2"
				>
					<span class="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
					{copied ? 'Copied' : 'Copy key'}
				</button>
				<button
					type="button"
					onclick={() => {
						mintedKey = null;
						errorMessage = '';
					}}
					class="py-4 px-6 rounded-2xl bg-surface-container-high text-on-surface font-label font-medium hover:bg-surface-container-highest transition-all font-body"
				>
					Done
				</button>
			</div>
		</div>
	</AdminModal>
</div>
