<script lang="ts">
	// Hero section. First screen. Under 10 seconds to convey:
	// 1. What QOS is  2. Why it matters  3. Status  4. CTA
	let { signupRef } = $props<{ signupRef?: () => void }>();

	function scrollToSignup(e: MouseEvent) {
		e.preventDefault();
		if (signupRef) signupRef();
		else document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section class="relative isolate overflow-hidden bg-dot-grid">
	<div
		class="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-5xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
		<!-- Eyebrow: standard id -->
		<div class="mb-10 flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-sm border border-border/80 bg-card">
				<svg viewBox="0 0 32 32" class="h-5 w-5 text-primary" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="16" cy="16" r="12" />
					<circle cx="16" cy="16" r="7" />
					<circle cx="16" cy="16" r="2.5" fill="currentColor" />
				</svg>
			</div>
			<div class="flex flex-col">
				<span class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Quietly Operating Standard</span>
				<span class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">v1.0.0 · values layer · shipped 2026-04-22</span>
			</div>
		</div>

		<!-- Headline -->
		<h1 class="font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
			Be who you are.
			<span class="block text-accent">Even when the machines speak for you.</span>
		</h1>

		<!-- Subhead -->
		<div class="mt-8 max-w-3xl space-y-5 text-lg text-muted-foreground md:text-xl">
			<p>
				<strong class="text-foreground">Quietly Operating Standard</strong> is the machine-readable
				operating layer for your organization's identity. Values, voice, brand, rules, relationships...
				locked in, version-controlled, cascading.
			</p>
			<p>
				So every AI agent working on your behalf honors your compass... instead of guessing it.
			</p>
		</div>

		<!-- Status + CTA -->
		<div class="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
			<a
				href="#signup"
				onclick={scrollToSignup}
				class="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-base font-medium text-accent-foreground shadow-lg shadow-accent/10 transition hover:bg-accent/90 hover:shadow-accent/20"
			>
				Keep me in the loop
				<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M4 10h12M11 5l5 5-5 5" />
				</svg>
			</a>
			<p class="font-mono text-xs text-muted-foreground/80">
				Under construction. Reference implementation ships first.
			</p>
		</div>

		<!-- Below-the-fold hint -->
		<div class="mt-24 flex items-center gap-3 text-xs text-muted-foreground/60">
			<span class="h-px flex-1 bg-border"></span>
			<span class="font-mono uppercase tracking-widest">Scroll for the vision</span>
			<span class="h-px flex-1 bg-border"></span>
		</div>
	</div>
</section>
