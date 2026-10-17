<script lang="ts">
	// Ecosystem section... QOS variant of the standard widget.
	// Per 005 Operations/Directives/qwf_ecosystem_landing_section.md §Customer-Facing Naming Rule:
	// full app names, no acronyms. Quietly Spotting is always center.
	//
	// For the QOS v1 landing, we render a simplified static-SVG orbit. No auto-cycle,
	// no spotlight, no complex interaction... QOS isn't an app in the widget sense; it's the
	// foundation. The widget here is positioning: "QOS is what these run on."
	//
	// Full interactive orbit (spotlight, auto-cycle, card sync) belongs in the QOP/QSP apps
	// per directive v2.1.1. For a road-sign landing, simplicity wins.
	//
	// Why the apps are not written here: which apps orbit, and their names, come from the shared
	// QWF list (see orbitFeed.ts), the same one every app page and the Universe page read. Only
	// this page's color per app lives here, with a plain default for an app added later.
	import { onMount } from 'svelte';
	import { ORBIT_FALLBACK, loadOrbitApps, type OrbitApp } from '$lib/ecosystem/orbitFeed';

	type Sat = {
		name: string;
		color: string;
		dashed?: boolean;
	};

	const COLORS: Record<string, string> = {
		qwr: '#d9a752',
		qqt: '#a78bfa',
		qtr: '#60a5fa',
		qnt: '#4ade80',
		qkn: '#fbbf24',
		qwb: '#22d3ee',
		qst: '#2dd4bf',
		qpn: '#fb923c'
	};
	const DEFAULT_COLOR = '#94a3b8';

	// QOS itself is not in the orbit... it is the foundation the orbit sits on. The two family
	// features always close the ring.
	const features: Sat[] = [
		{ name: 'QWF Passport', color: '#fbbf24' },
		{ name: 'Your Tools', color: '#94a3b8', dashed: true }
	];

	let apps = $state<OrbitApp[]>([...ORBIT_FALLBACK]);
	onMount(() => {
		// The live list; on any failure the built-in copy simply stays.
		loadOrbitApps().then((live) => {
			if (live) apps = live;
		});
	});

	let satellites = $derived<Sat[]>([
		...apps.map((a) => ({ name: a.name, color: COLORS[a.id] ?? DEFAULT_COLOR })),
		...features
	]);

	const center = { name: 'Quietly Spotting', color: '#10b981' };

	const cx = 300;
	const cy = 300;
	const r = 180;

	let positioned = $derived(
		satellites.map((s, i) => {
			const angle = -Math.PI / 2 + (i * 2 * Math.PI) / satellites.length;
			return {
				...s,
				x: cx + r * Math.cos(angle),
				y: cy + r * Math.sin(angle)
			};
		})
	);
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
					aria-label="QWF ecosystem orbit: Quietly Spotting at the center, the QWF apps and your tools around it"
				>
					<!-- Connecting lines -->
					{#each positioned as p (p.name)}
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
						<circle cx={cx} cy={cy} r="6" fill={center.color} />
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
					{#each positioned as p (p.name)}
						<g>
							{#if p.dashed}
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
