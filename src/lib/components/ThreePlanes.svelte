<script lang="ts">
	const planes = [
		{
			tag: 'Control',
			app: 'QOP',
			name: 'Quietly Operating',
			role: 'Writes',
			body: "Edit JSON values, voice, rules, relationships. UI sliders map to schema paths. Version-controlled. Variant-forkable for A/B testing."
		},
		{
			tag: 'Execution',
			app: 'QWB',
			name: 'Quietly Webbing',
			role: 'Executes',
			body: "Deploys supporter sites and runs operations against the resolved JSON. Deterministic pipelines. Zero LLM in the rendering path."
		},
		{
			tag: 'Observation',
			app: 'QSP',
			name: 'Quietly Spotting',
			role: 'Observes',
			body: "Dashboards, A/B results, change history, drift alerts. The SPOT where effects become visible."
		}
	];
</script>

<section class="border-t border-border/50 bg-card/20">
	<div class="mx-auto max-w-5xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">04</span>
			<span>The three planes</span>
		</div>

		<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
			Write. Execute. Observe.
		</h2>
		<p class="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
			QOS lives across three apps... each owning a single plane of concern. Classic
			write/execute/read separation from distributed systems, applied to organizational identity.
		</p>

		<div class="mt-14 grid gap-6 md:grid-cols-3">
			{#each planes as p, i}
				<div
					class="relative overflow-hidden rounded-sm border border-border/70 bg-card p-6 md:p-7"
				>
					<div
						class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent"
						aria-hidden="true"
					></div>
					<div class="flex items-baseline justify-between">
						<span class="font-mono text-[10px] uppercase tracking-widest text-accent">{p.tag}</span>
						<span class="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
							0{i + 1}
						</span>
					</div>
					<div class="mt-5">
						<div class="font-mono text-xs uppercase tracking-wider text-muted-foreground">{p.app}</div>
						<h3 class="mt-1 font-serif text-2xl text-foreground">{p.name}</h3>
					</div>
					<div class="mt-3 text-sm font-medium text-foreground/90">
						{p.role}
					</div>
					<p class="mt-4 text-sm text-muted-foreground md:text-base">{p.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
