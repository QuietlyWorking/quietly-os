// Parses QOS.development-map.json into a RenderableMap at build time.
// Applies the supporter-anonymity sweep in TS so the public surface is
// guaranteed safe even if someone forgets to run the Python render with
// sweep=on. Mirrors the logic in 005 Operations/Execution/render_qos_
// development_map.py.
//
// Called from src/routes/+page.server.ts so the map renders at build
// (SSR) time and the supporter sweep + em-dash scrub run during build,
// not per-request.

export type Status =
  | 'planned'
  | 'in-flight'
  | 'spec-only'
  | 'shipped'
  | 'blocked'
  | 'retrofit-needed';

export interface Phase {
  id: string;
  label: string;
  description: string;
  goal: string;
  order: number;
}

export interface NodeFile {
  path: string;
  kind: string;
  description?: string;
}

export interface Timestamps {
  planned_at?: string;
  in_flight_since?: string;
  spec_authored_at?: string;
  blocked_at?: string;
  retrofit_flagged_at?: string;
  shipped_at?: string;
}

export interface WorkingManualLink {
  date: string;
  heading: string;
}

export interface MapNode {
  id: string;
  phase: string;
  label: string;
  status: Status;
  description: string;
  why: string;
  timestamps?: Timestamps;
  files?: NodeFile[];
  depends_on?: string[];
  parallel_safe_with?: string[];
  working_manual_entry?: WorkingManualLink;
  tags?: string[];
  notes?: string;
  internal_only?: boolean;
  version?: string;
}

export interface Milestone {
  id: 'A' | 'B' | 'C';
  label: string;
  description: string;
  computed_from: {
    phase_ids?: string[];
    required_statuses?: string[];
    required_node_ids?: string[];
  };
}

export interface DevMapRaw {
  meta?: { mapVersion?: string };
  phases: Phase[];
  nodes: MapNode[];
  milestones: Milestone[];
}

// ---------- supporter-anonymity sweep ----------
//
// Mirror of memory/feedback_public_surfaces_no_supporter_names.md. Longest
// multi-word names first so they match before shorter tokens. Keep this
// list in sync with the Python sweep in render_qos_development_map.py;
// both must update when a new supporter is onboarded.

const SUPPORTER_NAMES = [
	'GreenCal Construction',
	'Petersen Legacy Law',
	'Gotham Good Dogs',
	'Orange County Newspapers',
	'Hazel Serrano',
	'Serrano family',
	'PetersenLegacyLaw',
	'GothamGoodDogs',
	'GreenCal',
	'Serrano',
	'Ramona',
	'Elaine',
	'OCN',
	'Sandra'
];

const ANON = 'a supporter brand';

// U+2014 em dash and U+2013 en dash by code point. This source stays clean of
// the literal characters so the em-dash-scrub CI step does not flag this file.
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

export function sweep(text: string | undefined): string {
	if (!text) return '';
	// em-dash + en-dash scrub (ellipsis replacement)
	let t = text.split(EM_DASH).join('...').split(EN_DASH).join('...');
	// supporter-anonymity sweep
	for (const name of SUPPORTER_NAMES) {
		if (t.includes(name)) t = t.split(name).join(ANON);
	}
	return t;
}

// ---------- milestone computation ----------

export interface MilestoneStatus {
	id: string;
	label: string;
	description: string;
	achieved: boolean;
	complete: number;
	total: number;
	distance: number;
}

export function computeMilestone(map: DevMapRaw, ms: Milestone): MilestoneStatus {
	const cf = ms.computed_from;
	const requiredStatuses = new Set(cf.required_statuses ?? ['shipped']);
	const phaseIds = cf.phase_ids ?? [];
	const requiredNodeIds = cf.required_node_ids ?? [];

	const nodeById: Record<string, MapNode> = {};
	for (const n of map.nodes) nodeById[n.id] = n;

	const phaseNodes = phaseIds.length ? map.nodes.filter((n) => phaseIds.includes(n.phase)) : [];
	const requiredNodes = requiredNodeIds
		.map((id) => nodeById[id])
		.filter((n): n is MapNode => Boolean(n));

	const seen = new Set<string>();
	const allRequired: MapNode[] = [];
	for (const n of [...phaseNodes, ...requiredNodes]) {
		if (seen.has(n.id)) continue;
		allRequired.push(n);
		seen.add(n.id);
	}
	const complete = allRequired.filter((n) => requiredStatuses.has(n.status));
	return {
		id: ms.id,
		label: sweep(ms.label),
		description: sweep(ms.description),
		achieved: allRequired.length > 0 && complete.length === allRequired.length,
		complete: complete.length,
		total: allRequired.length,
		distance: allRequired.length - complete.length
	};
}

// ---------- renderable shape ----------

export interface RenderableNode extends MapNode {
	label: string;
	description: string;
	why: string;
}

export interface RenderablePhase {
	id: string;
	label: string;
	description: string;
	goal: string;
	order: number;
	nodes: RenderableNode[];
	shipped: number;
	total: number;
}

export interface RenderableMap {
	mapVersion: string;
	summary: {
		total: number;
		shipped: number;
		pct: number;
		inFlight: RenderableNode[];
		specOnly: RenderableNode[];
		blocked: number;
		retrofit: number;
		planned: number;
	};
	milestones: MilestoneStatus[];
	phases: RenderablePhase[];
}

const STATUS_ORDER: Record<Status, number> = {
	shipped: 0,
	'in-flight': 1,
	'spec-only': 2,
	blocked: 3,
	'retrofit-needed': 4,
	planned: 5
};

// Apply sweep + sort for every renderable piece. internal_only nodes are
// filtered out of the public map. Called once at build time.
export function prepareMap(raw: DevMapRaw): RenderableMap {
	const publicNodes: RenderableNode[] = raw.nodes
		.filter((n) => !n.internal_only)
		.map((n) => ({
			...n,
			label: sweep(n.label),
			description: sweep(n.description),
			why: sweep(n.why),
			notes: n.notes ? sweep(n.notes) : undefined
		}));

	const total = publicNodes.length;
	const shipped = publicNodes.filter((n) => n.status === 'shipped').length;
	const pct = total ? Math.floor((shipped * 100) / total) : 0;
	const inFlight = publicNodes
		.filter((n) => n.status === 'in-flight')
		.sort((a, b) =>
			(a.timestamps?.in_flight_since ?? '').localeCompare(b.timestamps?.in_flight_since ?? '')
		);
	const specOnly = publicNodes.filter((n) => n.status === 'spec-only');
	const blocked = publicNodes.filter((n) => n.status === 'blocked').length;
	const retrofit = publicNodes.filter((n) => n.status === 'retrofit-needed').length;
	const planned = publicNodes.filter((n) => n.status === 'planned').length;

	const phases: RenderablePhase[] = raw.phases
		.slice()
		.sort((a, b) => a.order - b.order)
		.map((p) => {
			const phaseNodes = publicNodes
				.filter((n) => n.phase === p.id)
				.sort((a, b) => {
					const so = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
					if (so !== 0) return so;
					return a.id.localeCompare(b.id);
				});
			return {
				id: p.id,
				label: sweep(p.label),
				description: sweep(p.description),
				goal: sweep(p.goal),
				order: p.order,
				nodes: phaseNodes,
				shipped: phaseNodes.filter((n) => n.status === 'shipped').length,
				total: phaseNodes.length
			};
		});

	const milestones = raw.milestones.map((ms) => computeMilestone(raw, ms));

	return {
		mapVersion: raw.meta?.mapVersion ?? '?',
		summary: { total, shipped, pct, inFlight, specOnly, blocked, retrofit, planned },
		milestones,
		phases
	};
}
