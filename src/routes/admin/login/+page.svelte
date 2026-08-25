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

<div class="min-h-svh flex flex-col lg:flex-row">
	<!-- Brand panel (desktop) -->
	<aside class="hidden lg:flex lg:w-[46%] xl:w-[42%] relative overflow-hidden bg-zinc-950 text-white flex-col justify-between p-12 xl:p-16">
		<div class="absolute inset-0 bg-grid-pattern opacity-40"></div>
		<div class="absolute -top-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-blue-600/20 blur-[140px]"></div>
		<div class="absolute -bottom-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-indigo-600/10 blur-[140px]"></div>

		<!-- Brand -->
		<div class="relative flex items-center gap-3">
			<div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-headline font-black text-sm tracking-tight text-zinc-950">
				DF
			</div>
			<span class="font-headline text-lg font-bold tracking-tight">Dimas Febriyanto</span>
		</div>

		<!-- Pitch -->
		<div class="relative">
			<h1 class="font-headline text-3xl xl:text-4xl font-bold tracking-tight leading-tight mb-4">
				Manage your portfolio<br />from one place.
			</h1>
			<p class="text-zinc-400 text-[15px] leading-relaxed max-w-md mb-10">
				Update projects, publish articles, and keep your personal site up to date — all from a simple admin panel.
			</p>

			<ul class="space-y-4">
				<li class="flex items-center gap-3 text-sm text-zinc-300">
					<span class="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
						<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					</span>
					Content management made simple
				</li>
				<li class="flex items-center gap-3 text-sm text-zinc-300">
					<span class="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
						<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					</span>
					Projects, blog &amp; certifications
				</li>
				<li class="flex items-center gap-3 text-sm text-zinc-300">
					<span class="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
						<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					</span>
					Instant publishing &amp; updates
				</li>
			</ul>
		</div>

		<p class="relative text-xs text-zinc-500">&copy; {new Date().getFullYear()} Dimas Febriyanto. All rights reserved.</p>
	</aside>

	<!-- Form panel -->
	<main class="flex-1 bg-white flex items-center justify-center p-4 xs:p-6 overflow-y-auto">
		<div class="w-full max-w-sm my-auto py-8">
			<!-- Mobile brand -->
			<div class="lg:hidden flex flex-col items-center mb-8">
				<div class="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center font-headline font-black text-sm tracking-tight text-white mb-4">
					DF
				</div>
				<h1 class="font-headline text-2xl font-bold tracking-tight text-zinc-900 mb-1.5">Welcome back</h1>
				<p class="text-sm text-zinc-500">Sign in to your admin account</p>
			</div>

			<!-- Desktop heading -->
			<div class="hidden lg:block mb-8">
				<h1 class="font-headline text-[26px] font-bold tracking-tight text-zinc-900 mb-1.5">Sign in to your account</h1>
				<p class="text-sm text-zinc-500">Enter your credentials to continue.</p>
			</div>

			<form onsubmit={handleLogin} class="space-y-5">
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
						class="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 disabled:bg-zinc-100 disabled:cursor-not-allowed"
					/>
				</div>

				<div>
					<label for="password" class="block text-[13px] font-medium text-zinc-700 mb-1.5">Password</label>
					<input
						id="password"
						type="password"
						placeholder="Enter your password"
						autocomplete="current-password"
						bind:value={password}
						required
						disabled={retryAfter > 0}
						class="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 disabled:bg-zinc-100 disabled:cursor-not-allowed"
					/>
				</div>

				{#if error}
					<div class="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium">
						{error}
						{#if retryAfter > 0}
							<span class="block mt-1 text-xs">Coba lagi dalam {formatRetry(retryAfter)}</span>
						{/if}
					</div>
				{/if}

				<button
					type="submit"
					disabled={isLoading || retryAfter > 0}
					class="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium tracking-wide transition-all duration-200 hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
			</form>

			<p class="text-center text-xs text-zinc-400 mt-8">Restricted to authorized administrators only.</p>
		</div>
	</main>
</div>