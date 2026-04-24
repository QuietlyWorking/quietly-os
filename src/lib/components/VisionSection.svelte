<script lang="ts">
	const capabilities = [
		{
			tag: '01',
			title: 'Machine-readable',
			body: "Your identity as structured JSON. Not a 50-page brand guide nobody opens. Every agent can read it before generating anything on your behalf."
		},
		{
			tag: '02',
			title: 'Cascading',
			body: "Parent to child. Root values flow to every program, every supporter, every app. Children can extend or raise severity... never weaken an absolute rule."
		},
		{
			tag: '03',
			title: 'UI-editable',
			body: "A single slider changes a value. The Values Editor lets you test a policy against real fixtures before you ship it. No engineer required."
		},
		{
			tag: '04',
			title: 'Validator-enforced',
			body: "Structural checks, cross-reference checks, em-dash leaks, test-fixture shapes. If the standard forbids it, the standard catches it... at resolve time, not at review time."
		},
		{
			tag: '05',
			title: 'Agent-consumable',
			body: "Every LLM call on your behalf reads your resolved JSON first. Zero hallucination of values. Zero reinvention of voice. Full consistency across every tool."
		}
	];
</script>

<section class="border-t border-border/50 bg-card/20">
	<div class="mx-auto max-w-5xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">02</span>
			<span>The vision</span>
		</div>

		<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
			A protective shell for your organization.
		</h2>

		<p class="mt-8 max-w-3xl text-lg text-muted-foreground md:text-xl">
			QOS forces your organization to consider the things you forget to clarify when moving fast.
			Then it locks in the answers. So the next agent, the next tool, the next teammate operates
			inside the same frame.
		</p>

		<div class="mt-14 grid gap-px overflow-hidden rounded-sm border border-border/70 bg-border/70 md:grid-cols-2 lg:grid-cols-3">
			{#each capabilities as c}
				<div class="bg-card p-6 md:p-8">
					<div class="font-mono text-[10px] uppercase tracking-widest text-accent">{c.tag}</div>
					<h3 class="mt-3 font-serif text-xl text-foreground md:text-2xl">{c.title}</h3>
					<p class="mt-3 text-sm text-muted-foreground md:text-base">{c.body}</p>
				</div>
			{/each}
			<!-- Decorative 6th cell so grid completes on lg -->
			<div class="hidden bg-card/60 p-8 lg:block">
				<div class="flex h-full items-end">
					<blockquote class="border-l-2 border-accent/40 pl-4 font-serif text-sm italic text-muted-foreground">
						"It unlocks the full power of agentic superpowers... while fully retaining and
						locking-in the absolutes."
						<cite class="mt-2 block font-sans text-xs not-italic text-muted-foreground/70">
							<a
								href="https://chaplaintig.com"
								class="text-foreground underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
								rel="noopener noreferrer"
								target="_blank">TIG</a
							>, framing QOS
						</cite>
					</blockquote>
				</div>
			</div>
		</div>
	</div>
</section>
