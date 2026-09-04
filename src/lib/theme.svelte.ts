// ponytail: satu-satunya tempat tema disentuh — toggle, persist, circular reveal
class ThemeState {
	dark = $state(false);
	private inited = false;

	init() {
		if (this.inited) return;
		this.inited = true;
		try {
			const saved = localStorage.getItem('theme');
			this.dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
		} catch {
			this.dark = false;
		}
		document.documentElement.classList.toggle('dark', this.dark);
	}

	toggle(e?: MouseEvent) {
		const next = !this.dark;
		const apply = () => {
			this.dark = next;
			document.documentElement.classList.toggle('dark', next);
			try {
				localStorage.setItem('theme', next ? 'dark' : 'light');
			} catch {
				/* private mode */
			}
		};

		// View Transitions API tidak ada (Firefox lama) atau tanpa koordinat klik = ganti instan
		const startTransition = (
			document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
		).startViewTransition;
		if (!startTransition || !e) {
			apply();
			return;
		}
		const x = e.clientX;
		const y = e.clientY;
		const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
		try {
			const t = startTransition.call(document, apply);
			t.ready
				.then(() => {
					document.documentElement.animate(
						{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
						{ duration: 650, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
					);
				})
				.catch(() => {});
		} catch {
			apply();
		}
	}
}

export const theme = new ThemeState();
