<script lang="ts">
	// Ecosystem section... QOS variant of the standard widget.
	// Per 005 Operations/Directives/qwf_ecosystem_landing_section.md §Customer-Facing Naming Rule:
	// full app names, no acronyms. QSP is always center. Current "app" (QOS) at 12 o'clock.
	//
	// For the QOS v1 landing, we render a simplified static-SVG orbit. No auto-cycle,
	// no spotlight, no complex interaction... QOS isn't an app in the widget sense; it's the
	// foundation. The widget here is positioning: "QOS is what these run on."
	//
	// Full interactive orbit (spotlight, auto-cycle, card sync) belongs in the QOP/QSP apps
	// per directive v2.1.1. For a road-sign landing, simplicity wins.

	type Sat = {
		name: string;
		color: string; // tailwind color name
		status: 'live' | 'in-production';
		href: string;
	};

	// 8 satellites. Current "plane" (QOS) not in the orbit itself... QOS is the foundation the
	// orbit sits on. Instead we highlight the 3 planes + the 7 QWF programs + "Your Tools".
	const satellites: Sat[] = [
		{ name: 'Quietly Writing', color: '#d9a752', status: 'live', href: 'https://quietlywriting.org' },
		{ name: 'Quietly Quoting', color: '#a78bfa', status: 'in-production', href: 'https://quietlyquoting.org' },
		{ name: 'Quietly Tracking', color: '#60a5fa', status: 'in-production', href: 'https://quietlytracking.org' },
		{ name: 'Quietly Networking', color: '#4ade80', status: 'live', href: 'https://quietlynetworking.org' },
		{ name: 'Quietly Knocking', color: '#fbbf24', status: 'live', href: 'https://quietlyknocking.org' },
		{ name: 'Quietly Managing', color: '#fb923c', status: 'in-production', href: 'https://quietlymanaging.org' },
		{ name: 'QWF Passport', color: '#fbbf24', status: 'live', href: 'https://www.quietlyworking.org' },
		{ name: 'Your Tools', color: '#94a3b8', status: 'live', href: 'https://quietlyspotting.org' }
	];

	const center = { name: 'Quietly Spotting', color: '#10b981', href: 'https://quietlyspotting.org' };

	const cx = 300;
	const cy = 300;
	const r = 180;

	const positioned = satellites.map((s, i) => {
		const angle = -Math.PI / 2 + (i * 2 * Math.PI) / satellites.length;
		return {
			...s,
			x: cx + r * Math.cos(angle),
			y: cy + r * Math.sin(angle)
		};
	});
</script>

<section class="border-t border-border/50 bg-background">
	<div class="mx-auto max-w-5xl px-6 py-24 md:py-32">
		<div class="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
			<span class="font-mono">07</span>
			<span>The ecosystem</span>
		</div>

		<div class="grid gap-10 md:grid-cols-2 md:items-center">
			<div>
				<h2 class="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
					What QOS runs under.
				</h2>
				<div class="mt-8 space-y-5 text-lg text-muted-foreground md:text-xl">
					<p>
						The Quietly Working Foundation ecosystem... a constellation of apps each serving one
						domain well. QOS is the standard underneath them all.
					</p>
					<p>
						Quietly Spotting is your command center. Every other program reports into it. Supporters
						discover the constellation through any one door... and find out it's a universe.
					</p>
				</div>
				<a
					href="https://quietlyspotting.org/#ecosystem"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-accent/40 underline-offset-[6px] transition hover:decoration-accent"
				>
					See the full ecosystem
					<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M7 13l6-6M7 7h6v6" />
					</svg>
				</a>
			</div>

			<!-- Orbit SVG -->
			<div class="relative mx-auto aspect-square w-full max-w-[440px]">
				<svg
					viewBox="0 0 600 600"
					class="h-full w-full"
					preserveAspectRatio="xMidYMid meet"
					aria-label="QWF ecosystem orbit: Quietly Spotting center, seven programs and your tools in orbit"
				>
					<!-- Connecting lines -->
					{#each positioned as p}
						<line
							x1={cx}
							y1={cy}
							x2={p.x}
							y2={p.y}
							stroke="rgb(var(--border))"
							stroke-opacity="0.35"
							stroke-width="1"
						/>
					{/each}

					<!-- Center: Quietly Spotting (always) -->
					<g>
						<circle cx={cx} cy={cy} r="42" fill="none" stroke={center.color} stroke-opacity="0.4" stroke-width="2">
							<animate attributeName="r" values="42;46;42" dur="3s" repeatCount="indefinite" />
							<animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
						</circle>
						<circle cx={cx} cy={cy} r="32" fill="none" stroke={center.color} stroke-width="3" />
						<text
							x={cx}
							y={cy + 4}
							text-anchor="middle"
							font-family="system-ui, sans-serif"
							font-size="16"
							font-weight="600"
							fill={center.color}>QSP</text
						>
						<text
							x={cx}
							y={cy + 70}
							text-anchor="middle"
							font-family="system-ui, sans-serif"
							font-size="13"
							fill="rgb(var(--muted-foreground))">{center.name}</text
						>
					</g>

					<!-- Satellites -->
					{#each positioned as p}
						<g>
							{#if p.name === 'Your Tools'}
								<circle
									cx={p.x}
									cy={p.y}
									r="24"
									fill="none"
									stroke={p.color}
									stroke-width="2.5"
									stroke-opacity="0.55"
									stroke-dasharray="4 3"
								/>
							{:else}
								<circle
									cx={p.x}
									cy={p.y}
									r="24"
									fill="none"
									stroke={p.color}
									stroke-width="2.5"
									stroke-opacity="0.65"
								/>
							{/if}
							<text
								x={p.x}
								y={p.y + 50}
								text-anchor="middle"
								font-family="system-ui, sans-serif"
								font-size="11"
								fill="rgb(var(--muted-foreground))">{p.name}</text
							>
						</g>
					{/each}
				</svg>

				<p class="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
					QOS is the foundation these run on.
				</p>
			</div>
		</div>
	</div>
</section>
