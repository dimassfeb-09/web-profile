<script lang="ts">
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let retryAfter = $state(0);
	let timer: ReturnType<typeof setInterval> | null = null;

	function startCountdown(seconds: number) {
		retryAfter = seconds;
		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			retryAfter -= 1;
			if (retryAfter <= 0 && timer) {
				clearInterval(timer);
				timer = null;
			}
		}, 1000);
	}

	function formatRetry(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return m > 0 ? `${m}m ${s}s` : `${s}s`;
	}

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		if (retryAfter > 0) return;
		isLoading = true;
		error = '';

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();

			if (res.ok) {
				goto('/admin/dashboard');
			} else {
				if (res.status === 429) {
					const headerRetry = parseInt(res.headers.get('Retry-After') ?? '900', 10);
					startCountdown(Number.isFinite(headerRetry) ? headerRetry : 900);
				}
				error = data.message || 'Login failed';
			}
		} catch {
			error = 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-svh flex flex-col lg:flex-row bg-zinc-50">
	<!-- Left: brand (split minimal light) -->
	<aside class="hidden lg:flex lg:w-[46%] xl:w-[42%] bg-white border-r border-zinc-200 flex-col justify-between p-12 xl:p-14 relative overflow-hidden">
		<!-- subtle grid -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:32px_32px]"></div>
		<div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-zinc-100 blur-3xl"></div>

		<div class="relative flex items-center gap-3">
			<div class="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center font-headline font-black text-sm tracking-tight text-white">
				DF
			</div>
			<span class="font-headline text-[15px] font-semibold tracking-tight text-zinc-900">Dimas Febriyanto</span>
			<span class="ml-2 hidden xl:inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-500">Admin</span>
		</div>

		<div class="relative">
			<p class="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-600 mb-6">
				<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
				Portfolio CMS
			</p>
			<h1 class="font-headline text-[30px] xl:text-[32px] font-semibold tracking-tight leading-[1.15] text-zinc-900 mb-3">
				Manage your portfolio<br />with clarity.
			</h1>
			<p class="text-[14px] leading-relaxed text-zinc-500 max-w-md mb-8">
				Update projects, publish articles, and keep your site in sync — a clean workspace built for speed.
			</p>

			<ul class="space-y-3 max-w-md">
				<li class="flex gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3.5 items-center">
					<span class="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
						<span class="material-symbols-outlined text-[18px] text-white">dashboard</span>
					</span>
					<div class="min-w-0">
						<p class="text-[13px] font-medium text-zinc-900 leading-none">Content management</p>
						<p class="text-xs text-zinc-500 mt-1">Projects, blog & certifications</p>
					</div>
				</li>
				<li class="flex gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3.5 items-center">
					<span class="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
						<span class="material-symbols-outlined text-[18px] text-white">bolt</span>
					</span>
					<div class="min-w-0">
						<p class="text-[13px] font-medium text-zinc-900 leading-none">Instant publishing</p>
						<p class="text-xs text-zinc-500 mt-1">Updates live in seconds</p>
					</div>
				</li>
				<li class="flex gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3.5 items-center">
					<span class="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
						<span class="material-symbols-outlined text-[18px] text-white">verified</span>
					</span>
					<div class="min-w-0">
						<p class="text-[13px] font-medium text-zinc-900 leading-none">Secure workspace</p>
						<p class="text-xs text-zinc-500 mt-1">Rate-limited & protected access</p>
					</div>
				</li>
			</ul>
		</div>

		<p class="relative text-xs text-zinc-400">&copy; {new Date().getFullYear()} Dimas Febriyanto. All rights reserved.</p>
	</aside>

	<!-- Right: form -->
	<main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
		<div class="w-full max-w-[380px]">
			<!-- mobile brand -->
			<div class="lg:hidden flex flex-col items-center mb-6">
				<div class="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center font-headline font-black text-sm text-white mb-3">DF</div>
				<p class="text-xs font-medium tracking-wide text-zinc-500">Admin workspace</p>
			</div>

			<div class="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8">
				<div class="mb-6">
					<h1 class="font-headline text-xl font-semibold tracking-tight text-zinc-900">Sign in to your account</h1>
					<p class="text-sm text-zinc-500 mt-1">Enter your credentials to continue.</p>
				</div>

				<form onsubmit={handleLogin} class="space-y-4">
					<div>
						<label for="email" class="block text-[13px] font-medium text-zinc-700 mb-1.5">Email address</label>
						<input
							id="email"
							type="email"
							placeholder="admin@dimassfeb.com"
							autocomplete="email"
							bind:value={email}
							required
							disabled={retryAfter > 0}
							class="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 disabled:bg-zinc-100 disabled:cursor-not-allowed"
						/>
					</div>

					<div>
						<div class="flex items-center justify-between mb-1.5">
							<label for="password" class="block text-[13px] font-medium text-zinc-700">Password</label>
							<span class="text-xs text-zinc-400 hidden sm:block">Secure login</span>
						</div>
						<input
							id="password"
							type="password"
							placeholder="Enter your password"
							autocomplete="current-password"
							bind:value={password}
							required
							disabled={retryAfter > 0}
							class="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 disabled:bg-zinc-100 disabled:cursor-not-allowed"
						/>
					</div>

					{#if error}
						<div class="rounded-xl bg-red-50 border border-red-200 px-3.5 py-3 text-sm text-red-700 leading-relaxed">
							{error}
							{#if retryAfter > 0}
								<span class="block mt-1 text-xs font-medium">Coba lagi dalam {formatRetry(retryAfter)}</span>
							{/if}
						</div>
					{/if}

					<button
						type="submit"
						disabled={isLoading || retryAfter > 0}
						class="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium tracking-wide transition-all hover:bg-zinc-800 hover:shadow-md hover:shadow-zinc-900/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if isLoading}
							<div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
							Signing in...
						{:else if retryAfter > 0}
							Tunggu {formatRetry(retryAfter)}
						{:else}
							Sign in
						{/if}
					</button>

					<p class="text-center text-xs leading-relaxed text-zinc-400 pt-1">Restricted to authorized administrators only. Attempts are rate-limited.</p>
				</form>
			</div>

			<p class="text-center text-xs text-zinc-400 mt-6 lg:hidden">&copy; {new Date().getFullYear()} Dimas Febriyanto</p>
		</div>
	</main>
</div>
