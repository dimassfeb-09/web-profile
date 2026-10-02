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
		if (!iso) return 'never';
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
			errorMessage = 'Could not copy - select the key and copy it manually.';
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
		description="API keys for the /mcp endpoint. Mint one per trust level, not per agent: share a read key across everything that only looks things up."
		buttonLabel="Create Key"
		onButtonClick={openCreate}
	/>

	<div class="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 sm:p-8 space-y-4">
		<div class="flex items-start gap-4">
			<span class="material-symbols-outlined text-2xl text-primary">key</span>
			<div class="space-y-1">
				<h2 class="font-headline font-bold text-on-surface">Point your agent here</h2>
				<p class="text-sm text-on-surface-variant">
					{activeCount} active {activeCount === 1 ? 'key' : 'keys'}. The endpoint is
					<code class="font-mono text-xs">POST /mcp</code> over Streamable HTTP.
				</p>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
			<div class="bg-surface-container-high rounded-xl p-4">
				<p class="text-on-surface-variant mb-1">URL</p>
				<p class="text-on-surface break-all">https://www.dimassfeb.com/mcp</p>
			</div>
			<div class="bg-surface-container-high rounded-xl p-4">
				<p class="text-on-surface-variant mb-1">Header</p>
				<p class="text-on-surface break-all">Authorization: Bearer &lt;key&gt;</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{#each keys as key (key.id)}
			<div
				class={`border rounded-[2rem] p-8 flex flex-col gap-5 ${
					key.status === 'revoked'
						? 'bg-surface-container-low/40 border-outline-variant/10 opacity-60'
						: 'bg-surface-container-low border-outline-variant/10'
				}`}
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<h3 class="font-headline text-lg font-bold text-on-surface">{key.name}</h3>
						<p class="font-mono text-xs text-on-surface-variant mt-1">{key.prefix}</p>
					</div>
					<span
						class={`px-3 py-1.5 h-min rounded-xl font-label text-xs whitespace-nowrap ${
							key.status === 'revoked'
								? 'bg-surface-container-high text-on-surface-variant'
								: key.scope === 'read_write'
									? 'bg-error/10 text-error'
									: 'bg-primary/10 text-primary'
						}`}
					>
						{key.status === 'revoked' ? 'revoked' : key.scope}
					</span>
				</div>

				<dl class="space-y-2 text-xs">
					<div class="flex justify-between gap-4">
						<dt class="text-on-surface-variant">Created</dt>
						<dd class="text-on-surface text-right">{formatDate(key.created_at)}</dd>
					</div>
					<div class="flex justify-between gap-4">
						<dt class="text-on-surface-variant">Last used</dt>
						<dd class="text-right {key.last_used_at ? 'text-on-surface' : 'text-on-surface-variant'}">
							{formatDate(key.last_used_at)}
						</dd>
					</div>
				</dl>

				{#if key.status === 'active'}
					<p class="text-xs text-on-surface-variant">
						{#if !key.last_used_at}
							Never used. If you did not just create it, revoke this key.
						{:else}
							An unfamiliar timestamp here means the key leaked.
						{/if}
					</p>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleRevoke(key.prefix, key.name)}
						class="py-3 rounded-xl bg-surface-container-high text-error font-label text-sm font-medium hover:bg-error/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<span class="material-symbols-outlined text-sm">block</span>
						Revoke
					</button>
				{:else}
					<p class="text-xs text-on-surface-variant">
						Revoked {formatDate(key.revoked_at)}. Kept for the audit trail.
					</p>
				{/if}
			</div>
		{:else}
			<div class="col-span-full bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-12 text-center">
				<span class="material-symbols-outlined text-4xl text-on-surface-variant">key_off</span>
				<p class="mt-4 text-on-surface-variant">
					No keys yet. Create one to let an agent read this site.
				</p>
			</div>
		{/each}
	</div>

	<AdminModal isOpen={isModalOpen} onClose={() => (isModalOpen = false)} title="Create MCP Key">
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-2">
				<label for="key-name" class="font-label text-xs text-on-surface-variant ml-1">Name</label>
				<input
					id="key-name"
					type="text"
					required
					maxlength="60"
					placeholder="research"
					value={formName}
					oninput={(e) => (formName = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
				<p class="text-xs text-on-surface-variant ml-1">
					Name it after the client or trust level, not the machine - that is what makes
					"last used" tell you something.
				</p>
			</div>

			<fieldset class="space-y-3">
				<legend class="font-label text-xs text-on-surface-variant ml-1">Scope</legend>
				{#each [{ value: 'read', label: 'Read only', hint: 'get_content works. Anything that writes is refused.' }, { value: 'read_write', label: 'Read and write', hint: 'Full CRUD, including delete_content.' }] as const as option (option.value)}
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
							class="mt-1 accent-primary"
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

			<div class="pt-4">
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body disabled:opacity-50"
				>
					{isLoading ? 'Creating...' : 'Create Key'}
				</button>
			</div>
		</form>
	</AdminModal>

	<AdminModal isOpen={mintedKey !== null} onClose={() => (mintedKey = null)} title="Save your key">
		<div class="space-y-6">
			<div class="flex items-start gap-4 p-4 rounded-xl bg-primary/10">
				<span class="material-symbols-outlined text-primary">warning</span>
				<p class="text-sm text-on-surface">
					This key is shown once. Only its hash is stored, so it cannot be recovered - if you
					lose it, revoke and mint a new one.
				</p>
			</div>

			<div class="space-y-2">
				<span class="font-label text-xs text-on-surface-variant ml-1 block"
					>{mintedKey?.name} · {mintedKey?.scope}</span
				>
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
					class="flex-grow py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body"
				>
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