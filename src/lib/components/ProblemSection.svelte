<script lang="ts">
	// The problem. Owner-operator voice. No corporate framing.
	// Pain point: AI agents invent your identity every time.

	const drifts = [
		{
			label: 'Monday',
			output: 'Agent writes a LinkedIn post... sounds like your CEO.'
		},
		{
			label: 'Tuesday',
			output: 'New agent drafts a donor email... reads like a SaaS startup.'
		},
		{
			label: 'Wednesday',
			output: 'Support reply cites a policy you never set.'
		},
		{
			label: 'Thursday',
			output: 'Blog article uses vocabulary your brand forbids.'
		}
	];
</script>

<section class="border-t border-border/50 bg-background">
	<div class="mx-auto max-w-5xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">01</span>
			<span>The problem</span>
		</div>

		<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
			AI agents are inventing your identity.
			<span class="text-muted-foreground">Every single time.</span>
		</h2>

		<div class="mt-10 grid gap-8 md:grid-cols-5">
			<div class="space-y-5 text-base text-muted-foreground md:col-span-3 md:text-lg">
				<p>
					Every tool you connect to AI gets a different version of you. ChatGPT knows one thing. Claude
					knows another. The agent running your outreach knows a third. None of them share memory.
					None of them agree on your values. None of them know what you forbid.
				</p>
				<p>
					So they guess. They pattern-match. They hallucinate a brand voice that's close enough to
					plausible, and they ship it... before anyone checks.
				</p>
				<p class="text-foreground">
					The drift is invisible until it isn't.
				</p>
			</div>

			<!-- Right column: drift log (visual receipts) -->
			<div class="md:col-span-2">
				<div class="rounded-sm border border-border/70 bg-card/60 p-1 font-mono text-xs">
					<div class="flex items-center gap-2 border-b border-border/70 px-3 py-2 text-muted-foreground">
						<span class="h-2 w-2 rounded-full bg-destructive/70"></span>
						<span class="h-2 w-2 rounded-full bg-accent/70"></span>
						<span class="h-2 w-2 rounded-full bg-primary/70"></span>
						<span class="ml-2 tracking-wider uppercase">drift.log</span>
					</div>
					<ul class="divide-y divide-border/50">
						{#each drifts as d}
							<li class="px-3 py-3">
								<div class="text-[10px] uppercase tracking-widest text-muted-foreground/70">{d.label}</div>
								<div class="mt-1 text-foreground">{d.output}</div>
							</li>
						{/each}
					</ul>
				</div>
				<p class="mt-3 text-xs text-muted-foreground/70">
					A week of silent brand drift. Multiply by every supporter you serve.
				</p>
			</div>
		</div>
	</div>
</section>
