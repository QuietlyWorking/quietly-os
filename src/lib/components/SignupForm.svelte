<script lang="ts">
	let email = $state('');
	let consent = $state(true);
	let honeypot = $state('');
	let status: 'idle' | 'submitting' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (status === 'submitting' || status === 'success') return;

		if (!email || !email.includes('@')) {
			status = 'error';
			errorMessage = 'Please enter a valid email.';
			return;
		}

		status = 'submitting';
		errorMessage = '';

		try {
			const res = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, consent, honeypot })
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				status = 'error';
				errorMessage = body.error || 'Something went sideways on our end. Try again in a moment.';
				return;
			}
			status = 'success';
		} catch (err) {
			status = 'error';
			errorMessage = 'Network hiccup. Try again?';
		}
	}
</script>

<section id="signup" class="border-t border-border/50 bg-card/20">
	<div class="mx-auto max-w-3xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">08</span>
			<span>Keep me in the loop</span>
		</div>

		<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
			When there's real news... you'll hear it.
		</h2>

		<p class="mt-6 text-lg text-muted-foreground md:text-xl">
			QOS ships in phases. Each one unlocks a real capability. Drop your email and we'll tell you
			when something lands that matters.
		</p>

		{#if status !== 'success'}
			<form onsubmit={handleSubmit} class="mt-10 space-y-5" novalidate>
				<!-- Honeypot: hidden from humans, bots fill it -->
				<div class="sr-only" aria-hidden="true">
					<label for="website">Website</label>
					<input
						id="website"
						name="website"
						type="text"
						tabindex="-1"
						autocomplete="off"
						bind:value={honeypot}
					/>
				</div>

				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-foreground">
						Your email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						placeholder="you@example.org"
						autocomplete="email"
						bind:value={email}
						disabled={status === 'submitting'}
						class="w-full rounded-sm border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none disabled:opacity-60"
					/>
				</div>

				<label class="flex items-start gap-3 text-sm text-muted-foreground">
					<input
						type="checkbox"
						bind:checked={consent}
						class="mt-1 h-4 w-4 rounded border-border bg-background text-accent focus:ring-accent focus:ring-offset-background"
					/>
					<span>
						Send me QOS updates. Ship news only. No cadence theater.
					</span>
				</label>

				<button
					type="submit"
					disabled={status === 'submitting'}
					class="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-base font-medium text-accent-foreground shadow-lg shadow-accent/10 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{#if status === 'submitting'}
						Saving...
					{:else}
						Keep me in the loop
						<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 10h12M11 5l5 5-5 5" />
						</svg>
					{/if}
				</button>

				{#if status === 'error'}
					<p class="text-sm text-destructive" role="alert">{errorMessage}</p>
				{/if}
			</form>
		{:else}
			<div class="mt-10 rounded-sm border border-accent/40 bg-card p-6" role="status" aria-live="polite">
				<div class="flex items-start gap-4">
					<svg
						class="mt-0.5 h-6 w-6 flex-shrink-0 text-accent"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M5 13l4 4L19 7" />
					</svg>
					<div>
						<div class="font-serif text-xl text-foreground">You're on the list.</div>
						<p class="mt-2 text-sm text-muted-foreground">
							<a
								href="https://chaplaintig.com"
								class="text-foreground underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
								rel="noopener noreferrer"
								target="_blank">TIG</a
							>
							personally sees every signup. When the next phase ships, you'll know. Thanks for
							paying attention... it means more than you realize.
						</p>
					</div>
				</div>
			</div>
		{/if}

		<p class="mt-10 border-t border-border/50 pt-6 text-xs text-muted-foreground">
			<strong class="font-medium text-foreground">Private by default.</strong> We route these to
			<a
				href="https://chaplaintig.com"
				class="text-foreground underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
				rel="noopener noreferrer"
				target="_blank">TIG</a
			>
			personally. No team cc. No marketing automation. You get updates when there's real news.
		</p>
	</div>
</section>
