<script lang="ts">
	import { formatPacificDate } from '$lib/utils/timezone';
	import type { ManualEntry } from '$lib/working-manual';

	let { entries }: { entries: ManualEntry[] } = $props();
</script>

<section id="working-manual" class="border-t border-border/50 bg-background">
	<div class="mx-auto max-w-4xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">05</span>
			<span>The working manual</span>
		</div>

		<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
			Built in public.
			<span class="text-muted-foreground">Session by session.</span>
		</h2>

		<p class="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
			This is the live build log. Every session that ships QOS-relevant work appends an entry. No
			roadmap theater. Just what shipped, when, and what was real.
		</p>

		<!-- Timeline -->
		<ol class="mt-14 relative border-l border-border/60 pl-8 md:pl-10">
			{#each entries as e (e.date + e.title)}
				<li class="relative mb-12 last:mb-0">
					<!-- Dot -->
					<span
						class="absolute -left-[37px] flex h-4 w-4 items-center justify-center md:-left-[45px]"
						aria-hidden="true"
					>
						<span class="h-3 w-3 rounded-full bg-accent"></span>
						<span class="absolute h-6 w-6 rounded-full border border-accent/30"></span>
					</span>

					<!-- Date -->
					<time
						class="font-mono text-xs uppercase tracking-widest text-muted-foreground"
						datetime={e.date}
					>
						{formatPacificDate(e.date)}
					</time>

					<!-- Title -->
					<h3 class="mt-2 font-serif text-xl text-foreground md:text-2xl">{e.title}</h3>

					<!-- Body (pre-rendered HTML from WORKING_MANUAL.md) -->
					<div class="mt-4 space-y-3 text-base leading-relaxed">
						{@html e.html}
					</div>
				</li>
			{/each}
		</ol>

		<div class="mt-12 rounded-sm border border-dashed border-border/70 bg-card/30 p-5 text-sm text-muted-foreground">
			<strong class="font-mono text-xs uppercase tracking-wider text-foreground">Note</strong>
			<p class="mt-2">
				New entries get appended during the QWU backoffice's
				<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">/session-wrap-up</code>
				skill. The site rebuilds in ~60 seconds on push. Transparency in practice.
			</p>
		</div>
	</div>
</section>
