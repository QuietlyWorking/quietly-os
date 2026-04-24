<section class="border-t border-border/50 bg-background">
	<div class="mx-auto max-w-4xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">03</span>
			<span>Born from VOSPA</span>
		</div>

		<div class="space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
			<p>
				QOS isn't theory. It's 30 years of consulting methodology being programmatized.
			</p>
			<p>
				VOSPA... Values, Organization, Story, People, Automation... is the framework <a
					href="https://chaplaintig.com"
					class="text-foreground underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
					rel="noopener noreferrer"
					target="_blank">Chaplain TIG</a
				>
				has delivered as premium consulting ($10K+/month) for three decades. Every layer refined on
				Fortune 100 clients and Mom-and-Pop shops. Every mistake paid for.
			</p>
			<p>
				The app family we're building translates VOSPA into code. Any organization can access it
				through affordable donation... instead of paying for a consultant to write a PDF nobody
				reads.
			</p>
			<p class="text-foreground">
				QOS is the interoperability layer that makes it possible.
			</p>
		</div>

		<!-- VOSPA ladder: one row per letter, mapped to what's being built -->
		<dl class="mt-14 divide-y divide-border/50 overflow-hidden rounded-sm border border-border/70 bg-card/40">
			{#each [
				{ letter: 'V', name: 'Values', status: 'Shipped', body: 'values.v1 schema + cascade resolver + Values Editor spec.' },
				{ letter: 'O', name: 'Organization', status: 'In progress', body: 'Directives, SOPs, team and vendor data. Lives in QOP.' },
				{ letter: 'S', name: 'Story', status: 'In production', body: 'Quietly Writing: voice-matched content generation at scale.' },
				{ letter: 'P', name: 'People', status: 'In production', body: 'Teams, roles, relationships, and the people who make it run.' },
				{ letter: 'A', name: 'Automation', status: 'Infrastructure proven', body: 'n8n workflows, Python scripts, AI guardrails. Deterministic over probabilistic.' }
			] as row}
				<div class="grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-4 md:gap-8 md:px-8 md:py-5">
					<dt class="flex items-center gap-3">
						<span class="font-serif text-2xl text-accent md:text-3xl">{row.letter}</span>
						<span class="text-sm font-medium text-foreground md:text-base">{row.name}</span>
					</dt>
					<dd class="text-sm text-muted-foreground md:text-base">{row.body}</dd>
					<dd class="font-mono text-[10px] uppercase tracking-widest text-accent md:text-xs">
						{row.status}
					</dd>
				</div>
			{/each}
		</dl>

		<p class="mt-10 text-sm text-muted-foreground">
			The "Duct Tape to Rocket Ship" teaching series... 26 articles publishing progressively on
			<a
				href="https://chaplaintig.com"
				class="text-foreground underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
				rel="noopener noreferrer"
				target="_blank">chaplaintig.com</a
			>... walks through VOSPA for builders who want the 70% DIY path. Full standard, fully public, eventually.
		</p>
	</div>
</section>
