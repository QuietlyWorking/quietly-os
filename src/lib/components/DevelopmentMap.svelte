<script lang="ts">
	import type { RenderableMap } from '$lib/development-map';
	import { linkifyTIG } from '$lib/linkify';

	let { map }: { map: RenderableMap } = $props();

	function shortSince(iso: string | undefined): string {
		if (!iso) return '';
		// YYYY-MM-DD prefix for readability; ignores hour/offset for the summary line
		return iso.slice(0, 10);
	}
</script>

<section id="development-map" class="border-t border-border/50 bg-background">
	<div class="mx-auto max-w-4xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">05a</span>
			<span>The development map</span>
		</div>

		<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
			Origin to open standard.
			<span class="text-muted-foreground">Every node in the journey.</span>
		</h2>

		<p class="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
			QOS under QOS. The map itself is a reference implementation... same JSON-source-of-truth,
			deterministic-renderer, drift-validator, auto-update pattern every QOS schema follows.
			<strong class="text-foreground">{map.summary.shipped}</strong> of
			<strong class="text-foreground">{map.summary.total}</strong> nodes shipped
			({map.summary.pct}%).
		</p>

		<!-- You Are Here -->
		<div class="mt-10 rounded-sm border border-border/70 bg-card/30 p-6">
			<div class="mb-3 font-mono text-xs uppercase tracking-wider text-foreground">
				You are here
			</div>
			<p class="text-muted-foreground">
				Shipped <strong class="text-foreground">{map.summary.shipped}</strong>
				of {map.summary.total} ({map.summary.pct}%)
			</p>
			{#if map.summary.inFlight.length > 0}
				<div class="mt-4">
					<p class="text-foreground">
						<strong>{map.summary.inFlight.length} in-flight:</strong>
					</p>
					<ul class="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
						{#each map.summary.inFlight as n (n.id)}
							<li>
								<code class="font-mono text-sm text-foreground">{n.id}</code>
								... {@html linkifyTIG(n.label)}
								{#if n.timestamps?.in_flight_since}
									<span class="text-xs">(since {shortSince(n.timestamps.in_flight_since)})</span>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if map.summary.specOnly.length > 0}
				<div class="mt-4">
					<p class="text-foreground">
						<strong>{map.summary.specOnly.length} spec-only:</strong>
					</p>
					<ul class="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
						{#each map.summary.specOnly as n (n.id)}
							<li>
								<code class="font-mono text-sm text-foreground">{n.id}</code>
								... {@html linkifyTIG(n.label)}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<p class="mt-4 text-sm text-muted-foreground">
				Planned {map.summary.planned}
				{#if map.summary.blocked > 0} · Blocked {map.summary.blocked}{/if}
				{#if map.summary.retrofit > 0} · Retrofit-needed {map.summary.retrofit}{/if}
			</p>
		</div>

		<!-- Milestones -->
		<div class="mt-10">
			<h3 class="mb-4 font-mono text-xs uppercase tracking-wider text-foreground">
				Milestones
			</h3>
			<dl class="space-y-4">
				{#each map.milestones as ms (ms.id)}
					<div class="border-l-2 pl-4 {ms.achieved ? 'border-accent' : 'border-border'}">
						<dt class="font-serif text-lg text-foreground">
							<strong>{ms.id}</strong> ... {ms.label}
							<span class="ml-2 font-sans text-xs uppercase tracking-wider text-muted-foreground">
								{#if ms.achieved}
									achieved
								{:else}
									{ms.distance} of {ms.total} remaining
								{/if}
							</span>
						</dt>
						<dd class="mt-1 text-sm text-muted-foreground">{ms.description}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<!-- Per-phase trees -->
		<div class="mt-12 space-y-12">
			{#each map.phases as phase (phase.id)}
				<div>
					<h3 class="font-serif text-xl text-foreground md:text-2xl">
						<span class="font-mono text-base text-muted-foreground">{phase.id}</span>
						{phase.label}
						<span class="ml-2 font-sans text-sm text-muted-foreground">
							({phase.shipped}/{phase.total})
						</span>
					</h3>
					<p class="mt-2 max-w-2xl text-sm text-muted-foreground">{@html linkifyTIG(phase.description)}</p>
					<ul class="mt-4 space-y-3">
						{#each phase.nodes as n (n.id)}
							<li class="flex items-start gap-3 rounded-sm border border-border/40 bg-card/10 p-3">
								<span class="status-tag status-{n.status} shrink-0">
									{n.status}
								</span>
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
										<code class="font-mono text-xs text-foreground">{n.id}</code>
										<span class="text-sm font-medium text-foreground">{@html linkifyTIG(n.label)}</span>
									</div>
									<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
										{@html linkifyTIG(n.description)}
									</p>
									{#if n.depends_on && n.depends_on.length > 0}
										<p class="mt-1 text-xs text-muted-foreground">
											Depends on:
											{#each n.depends_on as d, i (d)}<code class="font-mono">{d}</code>{#if i < n.depends_on.length - 1}, {/if}{/each}
										</p>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Footer note -->
		<div class="mt-12 rounded-sm border border-dashed border-border/70 bg-card/30 p-5 text-sm text-muted-foreground">
			<strong class="font-mono text-xs uppercase tracking-wider text-foreground">Note</strong>
			<p class="mt-2">
				The map is authored at
				<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">005 Operations/Standards/roadmap/QOS.development-map.json</code>
				in the QWU backoffice. Every
				<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">/session-wrap-up</code>
				asks what nodes shipped, started, or retrofitted this session and calls the toggle
				script. Map version
				<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">v{map.mapVersion}</code>.
				Public render with supporter-anonymity sweep applied at build time.
			</p>
		</div>
	</div>
</section>

<style>
	.status-tag {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
		font-size: 0.6875rem; /* 11px */
		font-weight: 600;
		letter-spacing: 0.04em;
		padding: 0.25rem 0.5rem;
		border-radius: 2px;
		text-transform: lowercase;
		min-width: 90px;
		text-align: center;
	}
	.status-shipped {
		background-color: rgb(16 185 129 / 0.15);
		color: rgb(52 211 153);
	}
	.status-in-flight {
		background-color: rgb(245 158 11 / 0.15);
		color: rgb(251 191 36);
	}
	.status-spec-only {
		background-color: rgb(139 92 246 / 0.15);
		color: rgb(167 139 250);
	}
	.status-blocked {
		background-color: rgb(239 68 68 / 0.15);
		color: rgb(248 113 113);
	}
	.status-retrofit-needed {
		background-color: rgb(251 146 60 / 0.15);
		color: rgb(251 146 60);
	}
	.status-planned {
		background-color: rgb(107 114 128 / 0.15);
		color: rgb(156 163 175);
	}
</style>
